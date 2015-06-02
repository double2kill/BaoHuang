var express = require('express');
var app = express();
var http=require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname));

var userlist = {};
var id=0;
var username = new Array();
var pai = new Array();
var nextPlayerId = new Array();
var idgetshunxu = new Array();
var shunxugetid = new Array();
var renshu = 0;
var huangshangid = 0;
var buchu = 0;
var seat = new Array();
var onlineuser = [];

var gameNum=0;

app.get('',function(req,res){
	res.sendFile(__dirname + '/index.html');
});

app.get('/test',function(req,res){
	res.sendFile(__dirname + '/test.html');	
});


io.on('connection',function(socket){
	var user = {};

	socket.on('addin', function (usernameInput) {
		userId = socket.id
		username[userId] = usernameInput;
		user.socket = socket;
		userlist[userId] = user;
		userlist[userId].socket.emit('idInfo',username[userId]);	
		io.emit('system message',username[userId]+'进入了游戏');
		console.log('User ' + username[userId] + ' has connected!');
		onlineuser.push(username[userId]);
		io.emit('useronline',onlineuser);
		console.log('online: ' + onlineuser);
	});
	
	socket.on('get all username',function(){
		io.emit('useronline',onlineuser);
	});
	
	socket.on('someone is asking wang',function(){
		console.log(username[socket.id]+' is asking wang');
		socket.broadcast.emit('someOneAskingWang',username[socket.id]);
	})
	
	socket.on('bao',function(bao){
		console.log(bao);
		io.emit('bao',bao);
		huangshangid=socket.id;
		io.emit('huangshangname',username[socket.id]);
		socket.broadcast.emit('zhengzaichupai',username[socket.id]);
		daPai();
	})
	
	socket.on('send wang',function(){
		io.emit('bujiaowang',username[socket.id]);
		userlist[ nextPlayerId[socket.id] ].socket.emit('send wang');
	})

	socket.on('chat1 message', function(msg){
	    console.log('message: ' + msg);
	  });
	 socket.on('sendchupai',function(msg){
		buchu = 0;
		io.emit('chupainame',username[socket.id]);
		io.emit('jieshoupai',msg);
		//可以使用nextone函数。可以思考一下
		userlist[ nextPlayerId[socket.id] ].socket.emit('it is your turn');
		io.emit('zhengzaichupai',username[nextPlayerId[socket.id]]);
	})
	socket.on('rebegingame',function(){
		io.emit('start');
		begin();
	});
	socket.on('buchu',function(){
		io.emit('buchu',username[socket.id]);
		buchu++;
		if(buchu == 4){
			io.emit('clearchupaiarea');
			userlist[ nextPlayerId[socket.id] ].socket.emit('it is your begin',username[socket.id]);
			io.emit('zhengzaichupai',username[nextPlayerId[socket.id]]);
			buchu = 0;
		}
		else{
			userlist[ nextPlayerId[socket.id] ].socket.emit('it is your turn');
			io.emit('zhengzaichupai',username[nextPlayerId[socket.id]]);
		}
	});
	socket.on('over',function(){
		console.log(username[socket.id]+'is over');
	});
	socket.on('nextplayerbegin',function(){
		userlist[ nextPlayerId[socket.id] ].socket.emit('it is your begin',username[socket.id]);
		io.emit('zhengzaichupai','轮到'+ username[nextPlayerId[socket.id]]+'出牌');
		buchu = 0;
	});
	socket.on('voice',function(soundname){
		io.emit('voice', soundname);
	});
	socket.on('seat',function(seatid){
		seat[seatid] = username[socket.id];
		io.emit("send all seats",seat);
		
		gamename = [];
		gameNum = 0;
		for(i in seat){
			if(seat[i]!=null){
				gamename.push(seat[i]);
				gameNum++;
			}
		}
		console.log("gameing: " + gamename);
		console.log(gameNum);
		renShu=5;
		if (gameNum == renShu){
			begin();
		}
	});
	socket.on('get all seats',function(){
		socket.emit("send all seats",seat);
	});
	socket.on('disconnect',function(){
		this.broadcast.emit('system message', username[socket.id] + ' 退出了游戏' );
		console.log(username[socket.id] + ' has disconnected');
		onlineuser.splice(onlineuser.indexOf(username[socket.id]),1);
		io.emit('useronline',onlineuser);
		console.log('online: ' + onlineuser);
	});
	 
});

http.listen(3001,function(){
	console.log('listening on *:3001');
});

function begin(){
	
	fenpai();
	console.log("fenhaole");
	console.log(pai[1]);
	i=0;
	for(everyId in username){
		i++;
		idgetshunxu[everyId]=i;
		shunxugetid[i]=everyId;
		console.log('shunxu'+idgetshunxu[everyId]);
		console.log(pai[i]);
		userlist[everyId].socket.emit('your pai',pai[i]);
	}
	
	for(k=1;k<renShu;k++){
		nextPlayerId[ shunxugetid[k] ] = shunxugetid[k+1];
	}
	nextPlayerId[ shunxugetid[renShu] ] = shunxugetid[1];
}

function fenpai(){

	console.log('fenpai...');
	
	total = 217;
	//随机一堆牌
	var suiji = new Array();
	for(var i=0;i<total;i++){
		suiji[i]=new Array();
		suiji[i][0]=Math.random();
		suiji[i][1] = i+1; 
	}	
	suiji.sort();//排序
	//得到次序数组
	cixu = new Array();
	for(var i=0;i<total;i++){
		cixu[i]=suiji[i][1];
	}
	//分成5堆，并且没堆都排序一次,并且变成字符串的形式
	for (var i=0;i<5;i++){
		pai[i+1] = cixu.slice(total*i/5,total*(i+1)/5).sort(sortNumber);
		pai[i+1] = pai[i+1].join(",")+',';
	}
	//sortNumber是一个函数，作用时让sort是按数字的顺序进行排序，否则sort是按字母的顺序排序，具体就是12<2，因为12的第1位小于2。
	function sortNumber(a, b)
	{
	return a - b;
	}

}

function daPai(){
	io.emit('system message', '开始打牌' );
	io.emit('zhengzaichupai', '轮到'+username[huangshangid]+'出牌' );
	userlist[huangshangid].socket.emit('it is your begin');
}