var express=require('express');
var app =express();
var mysql = require('mysql');
var http=require('http');
var bodParser = require('body-parser')
var fs = require("fs");
var nodeMailer = require('nodemailer');
var checkCode = require('./checkCode');
var localhost = '47.113.84.128';
app.use(require('cors')());
	//链接数据库
	var connection = mysql.createConnection({
	 host: localhost,
	 user: 'root',
	 password : 'fd24330fc61c96d7',
	 database : 'music',
	 port: '3306',
	});
	connection.connect();
	//设置跨域访问
	app.all('*', function(req, res, next) {
	   res.header("Access-Control-Allow-Origin", "*");
	   res.header("Access-Control-Allow-Headers", "X-Requested-With");
	   res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
	   res.header("X-Powered-By",' 3.2.1');
	   res.header("Content-Type", "application/json;charset=utf-8");
	   res.header("Access-Control-Allow-Origin:*");
	   res.header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
	   next();
	   //设置允许跨域的域名，*代表允许任意域名跨域
	   res.header("Access-Control-Allow-Origin","*");
	   //允许的header类型
	   res.header("Access-Control-Allow-Headers","content-type");
	   //跨域允许的请求方式 
	   res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
	   if (req.method.toLowerCase() == 'options')
		   res.send(200);  //让options尝试请求快速结束
	   else
		   next();
	});
 	var result = {
        "status": "200",
        "message": "success",  
    }
	// connection.query('select * from users', function(err, rows, fields) {
	//  	if (err) throw err;	
	// 	console.log('结果为: ', rows);
	//  	return	result.data=rows;
	// });
	// connection.end();
	
	//账号匹配
	app.get('/login',async function(req,res){
		res.status(200),
		res.json(result)
		var connection = mysql.createConnection({
		 host: localhost,
		 user: 'root',
		 password : 'fd24330fc61c96d7',
		 database : 'music',
		 port: '3306',
		});
		connection.connect();
		//登录
		if(req.query.sql=="cz"){
			 connection.query('select * from users where username = \'' + req.query.name + '\' and password = \'' + req.query.pass +'\'', 
							function(err, rows, fields) {
				result.data=null;
				if(rows.length>0){
					console.log("登录成功",rows.length);
					console.log('结果为: ', rows);
				}else{
					console.log("用户名或密码错误")
				}
				if (err) console.log(err);
				result.data=rows;
			});	
		}
		//注册
		else if(req.query.sql=="cr"){
			connection.query('select * from users where username = \'' + req.query.name +'\'',
							function(err, rows, fields) {
				result.data=null;
				var a = 0;
				try{
					a = rows.length;
				}catch(err){
					console.log("error:" + err);
				}
				console.log("a=",a)
				if(a==0){
					connection.query('insert into users(username,password,mail) values(\'' + req.query.name + '\' , \'' + req.query.pass +'\', \'' + req.query.mail +'\')',
									function (err, res) {
						if (err) console.log(err);
						console.log('[INSERT ID] - ', res)
						result.data=res;
					});	
				}else{
					console.log("注册失败,账号已经注册或者密码不一致")
					result.data = "该用户已存在";
				}
				if (err) console.log(err);
			});	
		}
		//查看res状态
		else if(req.query.sql=="ff"){
			
		}
		setTimeout(()=>{
			connection.end();
		},2000)
	    console.log(req.url);
	    // console.log(req.query.name);
	});
	//获取收藏歌单
	app.get('/likes',async function(req,res){
		res.status(200),
		res.json(result)
		var connection = mysql.createConnection({
		 host: localhost,
		 user: 'root',
		 password : 'root',
		 database : 'music',
		 port: '3306',
		});
		connection.connect();
		//查找
		console.log(req.query);
		if(req.query.sql=="cz"){
			var  sql = 'select * from likes where userid = \'' + req.query.userid +'\'';
			//查
			connection.query(sql,function (err, res) {
					if(err){
					  console.log('[SELECT ERROR] - ',err.message);
					  return;
					}
				   result.data=res;
				   console.log('--------------------------SELECT----------------------------');
				   console.log(result);
				   console.log('------------------------------------------------------------\n\n');  
			});
		}
		//查看res状态
		else if(req.query.sql=="ff"){
			
		}
		setTimeout(()=>{
			connection.end();
		},2000)
	});
	//歌曲收藏
	app.get('/like',async function(req,res){
		res.status(200),
		res.json(result)
		var connection = mysql.createConnection({
		 host: localhost,
		 user: 'root',
		 password : 'root',
		 database : 'music',
		 port: '3306',
		});
		connection.connect();
		//收藏
		if(req.query.sql=="like"){
			var  addSql = 'INSERT INTO likes(userid,id,name,mvid,artist) VALUES(?,?,?,?,?)';
			var  addSqlParams = [req.query.userid, req.query.musicid,req.query.musicname,req.query.mvid,req.query.artist];
			 connection.query(addSql,addSqlParams,function(err, result) {
				result.data=null;
				if(err){
				         console.log('[INSERT ERROR] - ',err.message);
				         return;
				        }        
				       console.log('--------------------------INSERT----------------------------');
				       //console.log('INSERT ID:',result.insertId);        
				       console.log('INSERT ID:',result);        
				       console.log('-----------------------------------------------------------------\n\n'); 
			});	
		}
		//取消收藏
		else if(req.query.sql=="unlike"){
			var delSql = 'DELETE FROM likes where fromid=\'' + req.query.id +'\'';
			connection.query(delSql,function (err, result){
				result.data=null;
				if(err){
				          console.log('[DELETE ERROR] - ',err.message);
				          return;
					}        
			   console.log('--------------------------DELETE----------------------------');
			   console.log('DELETE affectedRows',result.affectedRows);
			   console.log('-----------------------------------------------------------------\n\n')
			});	
		}
		//查看res状态
		else if(req.query.sql=="ff"){
			
		}
		setTimeout(()=>{
			connection.end();
		},2000)
	    console.log(req.url);
	    // console.log(req.query.name);
	});
	//发送邮件
	app.get('/mail',function(req,res){
		res.status(200);
		res.json(result);
		console.log("Sendmail");
		result.data = 0;
		console.log(req.query);
		var mail1 = req.query.mail;
		if(req.query.sql == "ff"){
			
		}
		else{
			var n = checkCode.num(6);
			console.log("num = ",n);
			result.verCode = n;
			try {
			// 开启一个 SMTP 连接池
			var smtpTransport = nodeMailer.createTransport({
				// service: 'smtp.163.com',
				host: "smtp.qq.com", // 主机
				secureConnection: true, // 使用 SSL
				port: 465, // SMTP 端口
				auth: {
					user: "1311395125@qq.com", // 发件人账号
					pass: "nuxtappmpubibaee" // 授权码(这个是假的,改成发件人账号对应即可,获取方法: QQ邮箱-->设置-->账户-->POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务-->IMAP/SMTP开启 复制授权码)
				}
			});
			// 设置邮件内容
			var mailOptions = {
				from: "1311395125@qq.com", // 发件人地址(昵称 <发件人账号>)
				to: mail1, // 接收人列表,多人用','隔开
				subject: "验证码信息", // 标题
				html: "<b>thanks a for visiting!您的验证码为  <a href=\"javascript:;\">"+ n +"</a>  有效期为3分钟!!!</b><br/>", // html内容 图片src使用配置的cid
				// attachments :[{//完整配置参考 https://nodemailer.com/message/attachments/
				// 	filename: 'img1.png',            // 改成你的附件名
				// 	path: 'https://baidu.com/D9C55ACCC895.jpg',  // 链接是假的,仅供参考,可以改成相对路径,也可以是网络地址,其他的参考文档
				// 	cid : '00000001'                 // cid可被邮件使用
				// }]
			}
			// 发送邮件
			smtpTransport.sendMail(mailOptions, function(error, response){
				if(error){
					// res.end(JSON.stringify(error));
					console.log("Sendmail",error);
					result.data = 2;
				}else{
					// console.log("Message sent: " + response.message);
					result.data = 1;
					res.end(JSON.stringify(response));
				}
				smtpTransport.close(); // 发送完成关闭连接池
			});
		}catch (e) {
			// res.end(JSON.stringify(e));
			result.data = 2;
			console.log("Sendmail1",e);
		}	
	}
	})

	//写个接口123
	app.get('/music',function(req,res){
		res.status(200),
		res.json(result)
	    // console.log(req.stack);
	    // console.log(req.body);
	    console.log(req.url);
	    console.log(req.query.name);
	});
	app.post('/reg',function(req,res){
	    console.log(req.stack);
	    console.log(req.body);
	    console.log(req.url);
	    console.log(req.query);
	    res.json(req.body)
	})
	var account = ''	
	var psw = ''	
	app.get('/regist',function(req ,res){	
		var password = req.query.psw	
		var password2 = req.query.pswa ;	
		var user = req.query.user	
		if(user != account && password == password2)	
		{	
			account = user	
			psw = password	
			res.send('恭喜注册成功！账号是'+ user + ',密码是'	
			+ password + ',请妥善保管')	
		}	
		else {	
			res.send('注册失败,账号已经注册或者密码不一致')
			res.send('账号是'+ user + ',密码是' + password + ',请妥善保管')
		}
	})
	// fs.open("hello.txt","a+",function(err,fd){
	// 	if(!err){
	// 		fs.write(fd,"helo",function(err){
	// 			if(!err){
	// 				console.log("写入成功");
	// 			}
	// 		})
	// 	}
	// });
	
	//配置服务端口
	var server = app.listen(3306, function () {
	var host = server.address().address;
	var port = server.address().port;
	    console.log('Example app listening at http://%s:%s', host, port);
	})
