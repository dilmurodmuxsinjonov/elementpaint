// Resource readiness, not a fabricated network percentage. Failed resources
// settle too: a broken image must not trap visitors behind the loading screen.
export function trackReadiness(tasks,onProgress){
  let active=true,settled=0;onProgress(tasks.length?0:1);
  const done=Promise.allSettled(tasks.map(task=>Promise.resolve(task).finally(()=>{settled++;if(active)onProgress(settled/tasks.length);})));
  return {done,cancel(){active=false;}};
}
