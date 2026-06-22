tell application "Safari"
  activate
  if (count of windows) = 0 then make new document
  set URL of current tab of front window to "https://console.cloud.google.com/apis/credentials/oauthclient/791568444572-9bqnrn14j67gq0ahvih48ee48of9jads.apps.googleusercontent.com?project=791568444572"
  delay 12
  set js to "(()=>{const values=['https://lovequest-omega.vercel.app/api/auth/callback/google','http://localhost:3000/api/auth/callback/google','https://lovequest-omega.vercel.app','http://localhost:3000'];const existing=new Set([...document.querySelectorAll('input')].map(i=>(i.value||'').trim()));let added=0;for(const value of values){if(existing.has(value))continue;const buttons=[...document.querySelectorAll('button')].filter(b=>/add uri/i.test(b.textContent||''));if(buttons.length)buttons[buttons.length-1].click();const inputs=[...document.querySelectorAll('input[type=url],input[aria-label*=URI i]')];const empty=inputs.find(i=>!(i.value||'').trim());if(empty){empty.value=value;empty.dispatchEvent(new Event('input',{bubbles:true}));empty.dispatchEvent(new Event('change',{bubbles:true}));existing.add(value);added++;}}const save=[...document.querySelectorAll('button')].find(b=>/^save$/i.test((b.textContent||'').trim()));if(save&&added>0)save.click();return JSON.stringify({added,saved:!!(save&&added>0)});})()"
  do JavaScript js in current tab of front window
end tell
