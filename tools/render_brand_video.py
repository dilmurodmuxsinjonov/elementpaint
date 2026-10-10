"""Render a deterministic 5-second 3D intro with original package/logo textures.

Run with Blender --background --python this_file -- --output <D:/...>.
No generated typography, captions, product variants or external footage.
"""
import argparse
import math
import sys
from pathlib import Path

import bpy
from mathutils import Vector, Matrix

parser=argparse.ArgumentParser()
parser.add_argument('--output',type=Path,required=True)
parser.add_argument('--still',type=int)
args=parser.parse_args(sys.argv[sys.argv.index('--')+1:])
args.output.mkdir(parents=True,exist_ok=True)
web=Path(__file__).resolve().parent.parent/'element_paint_web'
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
scene=bpy.context.scene
scene.render.engine='BLENDER_EEVEE'
scene.render.resolution_x=scene.render.resolution_y=1080
scene.render.resolution_percentage=100
scene.render.fps=30;scene.frame_start=1;scene.frame_end=150
scene.render.image_settings.file_format='PNG';scene.render.image_settings.color_mode='RGB'
scene.render.film_transparent=False
scene.eevee.taa_render_samples=64
scene.view_settings.view_transform='AgX';scene.view_settings.look='None'
scene.world.use_nodes=True;scene.world.node_tree.nodes['Background'].inputs['Color'].default_value=(.9,.91,.86,1)
scene.world.node_tree.nodes['Background'].inputs['Strength'].default_value=.5

def material(name,color,roughness=.25,metallic=0):
    mat=bpy.data.materials.new(name);mat.use_nodes=True
    bsdf=mat.node_tree.nodes.get('Principled BSDF')
    bsdf.inputs['Base Color'].default_value=(*color,1)
    bsdf.inputs['Roughness'].default_value=roughness;bsdf.inputs['Metallic'].default_value=metallic
    return mat,bsdf

metal,_=material('Brushed stainless steel',(.56,.59,.58),.24,.95)
rim,_=material('Polished steel rim',(.74,.77,.75),.16,1)
blue,blue_bsdf=material('Berlak blue rear surface',(.012,.075,.35),.29,.18)
blue_bsdf.inputs['Coat Weight'].default_value=.3
white,white_bsdf=material('Snow White viscous paint',(.96,.965,.935),.20)
white_bsdf.inputs['Coat Weight'].default_value=.38;white_bsdf.inputs['Coat Roughness'].default_value=.12
white_bsdf.inputs['Subsurface Weight'].default_value=.015
white_bsdf.inputs['Emission Color'].default_value=(.96,.965,.935,1)
white_bsdf.inputs['Emission Strength'].default_value=.12

label,_=material('Original unaltered Berlak package photograph',(1,1,1),.34)
label_nodes=label.node_tree.nodes;label_links=label.node_tree.links
tex=label_nodes.new('ShaderNodeTexImage');tex.image=bpy.data.images.load(str(web/'assets/berlak_loader_can_v1.webp'))
tex.interpolation='Linear';label_links.new(tex.outputs['Color'],label_nodes.get('Principled BSDF').inputs['Base Color'])
label_nodes.get('Principled BSDF').inputs['Coat Weight'].default_value=.15

def mesh_object(name,vertices,faces,mat):
    mesh=bpy.data.meshes.new(name);mesh.from_pydata(vertices,[],faces);mesh.update()
    obj=bpy.data.objects.new(name,mesh);scene.collection.objects.link(obj);obj.data.materials.append(mat)
    return obj

root=bpy.data.objects.new('Can rigid transform',None);scene.collection.objects.link(root)
radius=.70;half_height=.90
verts=[];faces=[];uvs=[];segments=96
for row in range(2):
    for i in range(segments+1):
        phi=-math.pi/2+i/segments*math.pi
        x=radius*math.sin(phi);z=radius*math.cos(phi)
        verts.append((x,(-1 if row==0 else 1)*half_height,z))
        # Project the native front photograph onto the curved front body.
        u=.143+(x/radius+1)/2*.710;v=.095 if row==0 else .782
        uvs.append((u,v))
for i in range(segments):faces.append((i,i+1,segments+2+i,segments+1+i))
front=mesh_object('Authentic front label',verts,faces,label);front.parent=root
uv=front.data.uv_layers.new(name='Native photo projection')
for polygon in front.data.polygons:
    for loop in polygon.loop_indices:uv.data[loop].uv=uvs[front.data.loops[loop].vertex_index]
    polygon.use_smooth=True
back_verts=[]
for row in range(2):
    for i in range(segments+1):
        phi=math.pi/2+i/segments*math.pi
        back_verts.append((radius*math.sin(phi),(-1 if row==0 else 1)*half_height,radius*math.cos(phi)))
back=mesh_object('Blue rear metal shell',back_verts,faces,blue);back.parent=root
for polygon in back.data.polygons:polygon.use_smooth=True

def ring(name,y,major,minor,mat):
    bpy.ops.mesh.primitive_torus_add(major_radius=major,minor_radius=minor,major_segments=96,minor_segments=12,location=(0,y,0),rotation=(math.pi/2,0,0))
    obj=bpy.context.object;obj.name=name;obj.parent=root;obj.data.materials.append(mat)
    for polygon in obj.data.polygons:polygon.use_smooth=True
    return obj
for y in (-half_height,half_height):
    ring('Rolled metal edge',y,radius,.026,rim)
    ring('Rim inner bevel',y,radius-.045,.016,metal)
ring('Lower crimp line',-half_height+.065,radius+.002,.009,metal)
inside_steel,_=material('Shadowed inner steel wall',(.15,.18,.17),.3,.7)
inner_verts=[];inner_faces=[]
for row,y in enumerate((half_height-.09,half_height-.005)):
    for i in range(96):
        phi=i/96*math.tau;inner_verts.append(((radius-.049)*math.sin(phi),y,(radius-.049)*math.cos(phi)))
for i in range(96):inner_faces.append((i,(i+1)%96,(i+1)%96+96,i+96))
inner_wall=mesh_object('Open mouth cavity wall',inner_verts,inner_faces,inside_steel);inner_wall.parent=root
for polygon in inner_wall.data.polygons:polygon.use_smooth=True
mouth_white,mouth_bsdf=material('Visible Snow White inside open can',(.98,.98,.95),.21)
mouth_bsdf.inputs['Emission Color'].default_value=(.96,.965,.935,1);mouth_bsdf.inputs['Emission Strength'].default_value=.35
mouth_bsdf.inputs['Coat Weight'].default_value=.25
bpy.ops.mesh.primitive_cylinder_add(vertices=96,radius=radius-.052,depth=.014,location=(0,half_height-.08,0),rotation=(math.pi/2,0,0))
mouth=bpy.context.object;mouth.name='White paint below the open rim';mouth.parent=root;mouth.data.materials.append(mouth_white)
bevel=mouth.modifiers.new('Round paint meniscus','BEVEL');bevel.width=.012;bevel.segments=3
bpy.ops.mesh.primitive_cylinder_add(vertices=96,radius=radius-.025,depth=.025,location=(0,-half_height,0),rotation=(math.pi/2,0,0))
base=bpy.context.object;base.name='Steel can base';base.parent=root;base.data.materials.append(metal)

# Native alpha produces shared topology, preserving all letter holes and the crest.
logo=bpy.data.images.load(str(web/'assets/logo_light.png'))
width,height=logo.size;rgba=list(logo.pixels)
logo_width=4.15;logo_height=logo_width*height/width;logo_y=-1.20
mask=[[rgba[(y*width+x)*4+3]>.35 for x in range(width)] for y in range(height)]
logo_vertices=[];logo_faces=[];indices={}
def corner(x,y):
    key=(x,y)
    if key not in indices:
        indices[key]=len(logo_vertices)
        logo_vertices.append(((x/width-.5)*logo_width,(y/height-.5)*logo_height+logo_y,0))
    return indices[key]
for y in range(height):
    for x in range(width):
        if mask[y][x]:logo_faces.append((corner(x,y),corner(x+1,y),corner(x+1,y+1),corner(x,y+1)))
top=max(v[1] for v in logo_vertices);bottom=min(v[1] for v in logo_vertices)
glass,glass_bsdf=material('Translucent crystal logo',(.36,.48,.41),.12)
glass_bsdf.inputs['Coat Weight'].default_value=.75;glass_bsdf.inputs['IOR'].default_value=1.45
glass_nodes=glass.node_tree.nodes;glass_links=glass.node_tree.links
glass_mix=glass_nodes.new('ShaderNodeMixShader');transparent=glass_nodes.new('ShaderNodeBsdfTransparent')
glass_mix.inputs[0].default_value=.34;glass_links.new(transparent.outputs[0],glass_mix.inputs[1]);glass_links.new(glass_bsdf.outputs[0],glass_mix.inputs[2])
glass_links.new(glass_mix.outputs[0],glass_nodes.get('Material Output').inputs['Surface'])
glass.surface_render_method='DITHERED'
glass_obj=mesh_object('Original Element Paint glass silhouette',logo_vertices,logo_faces,glass)
solid=glass_obj.modifiers.new('Crystal wall depth','SOLIDIFY');solid.thickness=.055
bevel=glass_obj.modifiers.new('Soft crystal edges','BEVEL');bevel.width=.006;bevel.segments=2
bevel.limit_method='ANGLE'

liquid_mat,liquid_bsdf=material('Paint rising inside original logo',(.96,.965,.935),.20)
liquid_bsdf.inputs['Coat Weight'].default_value=.4
nodes=liquid_mat.node_tree.nodes;links=liquid_mat.node_tree.links
geo=nodes.new('ShaderNodeNewGeometry');xyz=nodes.new('ShaderNodeSeparateXYZ');links.new(geo.outputs['Position'],xyz.inputs[0])
level=nodes.new('ShaderNodeValue');level.label='Animated rising paint level'
time=nodes.new('ShaderNodeValue');time.label='Wave phase';amplitude=nodes.new('ShaderNodeValue');amplitude.label='Damped wave height'
def math_node(operation,*inputs):
    node=nodes.new('ShaderNodeMath');node.operation=operation
    for i,value in enumerate(inputs):
        if hasattr(value,'bl_idname') or hasattr(value,'is_output'):links.new(value,node.inputs[i])
        else:node.inputs[i].default_value=value
    return node.outputs[0]
xphase=math_node('MULTIPLY',xyz.outputs['X'],5.5)
phase=math_node('ADD',xphase,time.outputs[0]);wave=math_node('SINE',phase)
phase2=math_node('ADD',math_node('MULTIPLY',xyz.outputs['X'],10),math_node('MULTIPLY',time.outputs[0],-.72))
wave2=math_node('MULTIPLY',math_node('SINE',phase2),.35)
wave=math_node('MULTIPLY',math_node('ADD',wave,wave2),amplitude.outputs[0])
threshold=math_node('ADD',level.outputs[0],wave)
filled=math_node('LESS_THAN',xyz.outputs['Y'],threshold)
mix=nodes.new('ShaderNodeMixShader');empty=nodes.new('ShaderNodeBsdfTransparent')
links.new(filled,mix.inputs[0]);links.new(empty.outputs[0],mix.inputs[1]);links.new(liquid_bsdf.outputs[0],mix.inputs[2]);links.new(mix.outputs[0],nodes.get('Material Output').inputs['Surface'])
liquid_mat.surface_render_method='DITHERED'
liquid_obj=mesh_object('Logo-contained paint volume',logo_vertices,logo_faces,liquid_mat);liquid_obj.location.z=.037
solid=liquid_obj.modifiers.new('Thin paint volume','SOLIDIFY');solid.thickness=.035
bevel=liquid_obj.modifiers.new('Viscous rounded paint edge','BEVEL');bevel.width=.004;bevel.segments=2

entry_x=(.67-.5)*logo_width
# At the entry column, find the first original opaque pixel from above.
entry_col=round(width*.67)
entry_row=max(y for y in range(height) if mask[y][entry_col])
entry_y=(entry_row/height-.5)*logo_height+logo_y
tip=Vector((entry_x,1.45,.46));outlet=Vector((radius,half_height,.12))
stream_steps=72;stream_sides=16
stream_verts=[(0,0,0)]*((stream_steps+1)*stream_sides)
stream_faces=[]
for i in range(stream_steps):
    for j in range(stream_sides):
        a=i*stream_sides+j;b=i*stream_sides+(j+1)%stream_sides
        stream_faces.append((a,b,b+stream_sides,a+stream_sides))
stream=mesh_object('Continuous viscous Snow White stream',stream_verts,stream_faces,white)
for polygon in stream.data.polygons:polygon.use_smooth=True

background,background_bsdf=material('Warm morning ivory backdrop',(.78,.71,.59),.85)
background_bsdf.inputs['Emission Color'].default_value=(1.05,.91,.72,1)
background_bsdf.inputs['Emission Strength'].default_value=.65
bpy.ops.mesh.primitive_plane_add(size=200,location=(0,0,-.18));backdrop=bpy.context.object;backdrop.name='Quiet warm background';backdrop.data.materials.append(background)
def area(name,location,energy,size,color,target=(0,0,0)):
    data=bpy.data.lights.new(name,'AREA');data.energy=energy;data.shape='DISK';data.size=size;data.color=color
    obj=bpy.data.objects.new(name,data);scene.collection.objects.link(obj);obj.location=location;obj.rotation_euler=(Vector(target)-obj.location).to_track_quat('-Z','Y').to_euler()
area('Soft morning key',(-3,4,6),550,4.5,(1,.94,.82))
area('Gentle front fill',(3,-1,5),220,4,(.91,.96,1))
area('Metal rim reflection',(-2,1,3),120,2,(1,.98,.9))
bpy.ops.object.camera_add(location=(0,2.7,11))
camera=bpy.context.object;camera.rotation_euler=(-math.atan2(2.7-.35,11),0,0)
camera.data.type='ORTHO';camera.data.ortho_scale=6.45;scene.camera=camera

def clamp(value):return max(0,min(1,value))
def ease(value):value=clamp(value);return value*value*(3-2*value)
def update(scene,*unused):
    seconds=(scene.frame_current-1)/30
    amount=clamp((seconds-.7)/3)
    tilt=math.radians(-64)*ease(seconds/.7)*(1-ease((seconds-3.7)/.8))
    rotation=Matrix.Rotation(tilt,3,'Z');root.rotation_euler=(0,0,tilt);root.location=tip-rotation@outlet
    level.outputs[0].default_value=bottom-.015+(top-bottom+.04)*amount
    envelope=min(1,amount*8,(1-amount)*10)
    amplitude.outputs[0].default_value=.026*envelope
    time.outputs[0].default_value=seconds*4
    pouring=.7<seconds<3.7
    stream.hide_render=not pouring
    if pouring:
        taper=clamp((seconds-.7)*9)*clamp((3.7-seconds)*10)
        for i in range(stream_steps+1):
            p=i/stream_steps
            # The visible jet stops on the upper original letter; negative spaces stay dry.
            y=tip.y+(entry_y+.02-tip.y)*p
            x=tip.x+.009*math.sin(p*math.pi)*math.sin(seconds*5)
            z=tip.z+(.09-tip.z)*p
            r=.058/math.sqrt(1+2.5*p)*(1+.035*math.sin(seconds*12-p*15))*taper
            for j in range(stream_sides):
                angle=j/stream_sides*math.tau
                stream.data.vertices[i*stream_sides+j].co=(x+math.cos(angle)*r,y,z+math.sin(angle)*r)
        stream.data.update()

bpy.app.handlers.frame_change_pre.append(update)
scene.frame_set(args.still or 1)
bpy.ops.wm.save_as_mainfile(filepath=str(args.output/'elementpaint-pour.blend'))
if args.still:
    scene.render.filepath=str(args.output/f'preview-{args.still:03d}.png')
    bpy.ops.render.render(write_still=True)
else:
    scene.render.filepath=str(args.output/'frame-')
    bpy.ops.render.render(animation=True)
