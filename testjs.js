
pai=[];

//新添
var mypai = new Array();
 
fenpai();
console.log("fenhaole");
var a=[];
a.push('234');
a.push('liuchen');
console.log(a);

function fenpai(){

	console.log('fenpai...');
	
	total = 217;
	//随机一堆牌
	var suiji = new Array();
	for(i=0;i<total;i++){
		suiji[i]=new Array();
		suiji[i][0]=Math.random();
		suiji[i][1] = i+1; 
	}	
	suiji.sort();//排序
	//得到次序数组
	cixu = new Array();
	for(i=0;i<total;i++){
		cixu[i]=suiji[i][1];
	}
	//分成5堆，并且没堆都排序一次,并且变成字符串的形式
	for (i=0;i<5;i++){
		pai[i+1] = cixu.slice(total*i/5,total*(i+1)/5).sort(sortNumber);
		pai[i+1] = pai[i+1].join(",");
	}
	//sortNumber是一个函数，作用时让sort是按数字的顺序进行排序，否则sort是按字母的顺序排序，具体就是12<2，因为12的第1位小于2。
	function sortNumber(a, b)
	{
	return a - b
	}
	console.log(pai[2]);
}