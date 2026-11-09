"""Builds the wine bottle models for the homepage and exports them for the web.

Run with Blender's Python (either works):

    blender --background --python assets/blender/build_bottles.py
    python assets/blender/build_bottles.py        # with `pip install bpy`

Writes assets/blender/bottles.blend (the editable source) and public/models/bottles.glb (what the site loads).

Each bottle is three meshes that share the materials "Glass", "Label" and "Foil". The site recolors those
materials per wine and paints the label texture at runtime, so one model serves every wine of that shape.
Units are metres, bottles stand along +Z and are centred on the origin, and the label faces -Y (the front).
"""

import math
from pathlib import Path

import bpy

ROOT = Path(__file__).resolve().parents[2]
BLEND_PATH = ROOT / "assets" / "blender" / "bottles.blend"
GLB_PATH = ROOT / "public" / "models" / "bottles.glb"

HEIGHT = 0.30
SEGMENTS = 64
LIP = [(0.0158, 0.288), (0.0158, 0.296), (0.0145, 0.300), (0.0005, 0.3002)]
FOIL_LIP = [(0.0146, 0.286), (0.0164, 0.288), (0.0164, 0.2965), (0.0150, 0.3006), (0.0005, 0.3008)]

# Profiles are (radius, height) pairs from the centre of the base up to the centre of the mouth.
SHAPES = {
    # High square shoulders: the tintos and the sweet Pedro Ximénez.
    "Bordelesa": {
        "glass": [
            (0.0005, 0.006), (0.020, 0.004), (0.034, 0.0), (0.0375, 0.003), (0.038, 0.008), (0.038, 0.06),
            (0.038, 0.12), (0.038, 0.185), (0.0372, 0.196), (0.033, 0.208), (0.025, 0.218), (0.0175, 0.226),
            (0.0150, 0.236), (0.0142, 0.250), (0.0140, 0.286), *LIP,
        ],
        "foil": [(0.0156, 0.240), (0.0148, 0.250), *FOIL_LIP],
        "label": {"radius": 0.0386, "bottom": 0.065, "top": 0.150},
    },
    # Long sloping shoulders: Moscatel and the rosados.
    "Borgona": {
        "glass": [
            (0.0005, 0.006), (0.022, 0.004), (0.037, 0.0), (0.0405, 0.003), (0.041, 0.008), (0.041, 0.07),
            (0.041, 0.130), (0.040, 0.150), (0.036, 0.175), (0.030, 0.198), (0.023, 0.220), (0.0175, 0.240),
            (0.0148, 0.258), (0.0140, 0.286), *LIP,
        ],
        "foil": [(0.0181, 0.240), (0.0154, 0.258), *FOIL_LIP],
        "label": {"radius": 0.0416, "bottom": 0.045, "top": 0.120},
    },
}
LABEL_ARC = math.radians(160)


def lathe(profile):
    """Revolves a profile around Z. Returns vertices and faces with outward normals."""
    verts, faces = [], []
    for radius, z in profile:
        for s in range(SEGMENTS):
            angle = 2 * math.pi * s / SEGMENTS
            verts.append((radius * math.cos(angle), radius * math.sin(angle), z - HEIGHT / 2))
    for k in range(len(profile) - 1):
        for s in range(SEGMENTS):
            a, b = k * SEGMENTS + s, k * SEGMENTS + (s + 1) % SEGMENTS
            faces.append((a, b, b + SEGMENTS, a + SEGMENTS))
    last = (len(profile) - 1) * SEGMENTS
    faces.append(tuple(reversed(range(SEGMENTS))))  # base cap, facing down
    faces.append(tuple(range(last, last + SEGMENTS)))  # mouth cap, facing up
    return verts, faces


def label_band(radius, bottom, top, columns=24):
    """A strip of cylinder on the front of the bottle, with UVs covering the whole 0-1 square."""
    verts, faces, uvs = [], [], []
    for j, z in enumerate((bottom, top)):
        for i in range(columns + 1):
            u = i / columns
            angle = (u - 0.5) * LABEL_ARC
            verts.append((radius * math.sin(angle), -radius * math.cos(angle), z - HEIGHT / 2))
            uvs.append((u, float(j)))
    for i in range(columns):
        faces.append((i, i + 1, i + columns + 2, i + columns + 1))
    return verts, faces, uvs


def material(name, color, roughness, metallic=0.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (*color, 1.0)
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    return mat


def add_mesh(name, verts, faces, mat, parent, uvs=None):
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(verts, [], faces)
    if uvs:
        layer = mesh.uv_layers.new(name="UVMap")
        for loop in mesh.loops:
            layer.data[loop.index].uv = uvs[loop.vertex_index]
    mesh.polygons.foreach_set("use_smooth", [True] * len(mesh.polygons))
    mesh.materials.append(mat)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    obj.parent = parent
    bpy.context.collection.objects.link(obj)
    return obj


def main():
    bpy.ops.wm.read_factory_settings(use_empty=True)

    glass = material("Glass", (0.05, 0.09, 0.04), 0.06)
    label = material("Label", (0.94, 0.90, 0.80), 0.85)
    foil = material("Foil", (0.28, 0.03, 0.09), 0.35, metallic=0.6)

    for index, (name, shape) in enumerate(SHAPES.items()):
        root = bpy.data.objects.new(name, None)
        root.location.x = index * 0.12  # side by side in the .blend; the site recentres each one
        bpy.context.collection.objects.link(root)

        body = add_mesh(f"{name}_Glass", *lathe(shape["glass"]), glass, root)
        body.modifiers.new("Subdivision", "SUBSURF").levels = 1  # rounds the shoulders and the base
        add_mesh(f"{name}_Foil", *lathe(shape["foil"]), foil, root)
        verts, faces, uvs = label_band(**shape["label"])
        add_mesh(f"{name}_Label", verts, faces, label, root, uvs)

    BLEND_PATH.parent.mkdir(parents=True, exist_ok=True)
    GLB_PATH.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=str(BLEND_PATH))
    bpy.ops.export_scene.gltf(filepath=str(GLB_PATH), export_format="GLB", export_apply=True, export_yup=True)
    print(f"Wrote {BLEND_PATH} and {GLB_PATH}")


if __name__ == "__main__":
    main()
