let bluedonWebSocket = {
  wsUrl:'',
  open:startWS,
  member_id:'',
  access_token:'',
  vm:'',
  type:'',
  isOpen:false,
  childVm:'',
  ws:null,
  close:closeWS
}

function startWS () {
  if(window.location.protocol == 'https:'){
    bluedonWebSocket.ws = new WebSocket(`wss://${bluedonWebSocket.wsUrl}?method=login&member_id=${bluedonWebSocket.member_id}&access_token=${bluedonWebSocket.access_token}`);
  }else{
    bluedonWebSocket.ws = new WebSocket(`ws://${bluedonWebSocket.wsUrl}?method=login&member_id=${bluedonWebSocket.member_id}&access_token=${bluedonWebSocket.access_token}`);
  }
  bluedonWebSocket.ws.onopen = (evt) => {
    bluedonWebSocket.isOpen = true;
  };

  bluedonWebSocket.ws.onmessage = (evt) => {
    let data = JSON.parse(evt.data)
    if(data.code == '2061'){
      vm.$cookie.remove(vm.$api.ctk);
      vm.$cookie.remove('memberId');
      clearInterval(vm.$cookie.get("loginCheckTimer"));
      vm.$alert('此账号在别处登录，被下线', '下线', {
        confirmButtonText: '确定',
        close () {
          window.location.reload();
        }
      });
      return false;
    }
    switch(bluedonWebSocket.type){
      case 'messageCenter':
        bluedonWebSocket.childVm.proclaims();
        if(data.data.unread_count && data.data.unread_count > 0){
          vm.$store.commit('SET_UNREAD_MSG',true);
        }else{
          vm.$store.commit('SET_UNREAD_MSG',false);
        }
      break;
      case 'common':
        if(data.data.unread_count && data.data.unread_count > 0){
          vm.$store.commit('SET_UNREAD_MSG',true);
        }else{
          vm.$store.commit('SET_UNREAD_MSG',false);
        }
      break;
    }
    
  };

  bluedonWebSocket.ws.onclose = (evt) => {
    console.log(evt)
  };

  switch (bluedonWebSocket.ws.readyState) {
    case WebSocket.CONNECTING:
      // do something
      break;
    case WebSocket.OPEN:
      // do something
      break;
    case WebSocket.CLOSING:
      // do something
      break;
    case WebSocket.CLOSED:
      // do something
      break;
    default:
      // this never happens
      break;
  }

  setInterval(()=>{
    bluedonWebSocket.ws.send('heartbeat');
  },50000)
}
function closeWS () {
  bluedonWebSocket.ws.close();
}
export default bluedonWebSocket ;