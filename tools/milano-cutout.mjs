// Remove only near-black pixels connected to the outer background. Dark areas
// inside the printed label remain opaque, and all source RGB values are kept.
export function cutoutMilanoBackground(data,{width,height,channels}){
  const size=width*height,background=new Uint8Array(size),queue=new Int32Array(size);
  let head=0,tail=0;
  function visit(index){
    if(background[index])return;
    const offset=index*channels;
    if(Math.max(data[offset],data[offset+1],data[offset+2])>8)return;
    background[index]=1;queue[tail++]=index;
  }
  for(let x=0;x<width;x++){visit(x);visit((height-1)*width+x);}
  for(let y=0;y<height;y++){visit(y*width);visit(y*width+width-1);}
  while(head<tail){
    const index=queue[head++],x=index%width;
    if(x>0)visit(index-1);if(x<width-1)visit(index+1);
    if(index>=width)visit(index-width);if(index<size-width)visit(index+width);
  }
  const rgba=Buffer.alloc(size*4);
  for(let i=0;i<size;i++){
    const source=i*channels,target=i*4;
    rgba[target]=data[source];rgba[target+1]=data[source+1];rgba[target+2]=data[source+2];
    rgba[target+3]=background[i]?0:255;
  }
  return {rgba,removedPixels:tail};
}
