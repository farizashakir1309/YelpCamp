 var express=require("express");
 var app=express();
 var bodyParser=require("body-parser");
 var mongoose=require("mongoose");
 var flash=require("connect-flash");
 var passport=require("passport");
var LocalStrategy=require("passport-local");
var methodOverride=require("method-override");
 var Campground=require("./models/campground");
var seedDB=require("./seeds");
 var Comment=require("./models/comment");
 var User=require("./models/user");
//seed the database
//seedDB();
var commentRoutes=require("./routes/comments");
var campgroundRoutes=require("./routes/campgrounds");
var indexRoutes=require("./routes/index");
mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser:true});
app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine", "ejs");
app.use(express.static(__dirname +"/public"));
app.use(methodOverride("_method"));
app.use(flash());
//PASSPORT CONFIGURATION 
app.use(require("express-session")({
		secret:"my first app",
	resave:false,
	saveUninitialized:false
		}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
		res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
		next();
		});
// app.get("/",function(req,res){
// 	res.render("landing");
// });

//INDEX - show all campgrounds
// app.get("/campgrounds",function(req,res){
	
// 	Campground.find({},function(err,allcampgrounds){
// 		if(err){
// 			console.log(err);
// 		}else{
// 			res.render("campgrounds/index",{campgrounds:allcampgrounds});
// 		}
// 	});
// 	//res.render("campgrounds",{campgrounds:campgrounds});
// });
// app.post("/campgrounds",function(req,res){
// 	var name=req.body.name;
// 	var image=req.body.image;
// 	var desc=req.body.description;
// 	var newCampground={name: name,image: image,description: desc}
// 	Campground.create(newCampground,function(err,newlyCreated){
// 		if(err){
// 			console.log(err);
// 		}else{
// 			res.redirect("/campgrounds");
// 		}
// 	});
	
// });
// app.get("/campgrounds/new",function(req, res){
// 	res.render("campgrounds/new");
// });
// //show-shows more info about campgrounds
// app.get("/campgrounds/:id",function(req , res){
// //find campground with provided ID
// 	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
// 		if(err){
// 			console.log(err);
// 		}else{
// 			//render show template with that campground
// 			console.log(foundCampground);
// 			res.render("campgrounds/show",{campground:foundCampground});
// 		}
// 	});
// 	//req.params.id
// 	//res.render("show");
// });


//comments routes
// app.get("/campgrounds/:id/comments/new", isLoggedIn,function(req,res){
// 	//find campground by id
// 	Campground.findById(req.params.id,function(err,campground){
// 		if(err){
// 			console.log(err);
// 		}else{
// 			res.render("comments/new",{campground: campground});
// 		}
// 	})
	
// });
// app.post("/campgrounds/:id/comments",isLoggedIn,function(req,res){
// 	//lookup campground using ID
// 	Campground.findById(req.params.id,function(err,campground){
// 		if(err){
// 			console.log(err);
// 			res.redirect("/campgrounds");
// 		}else{
// 			Comment.create(req.body.comment,function(err,comment){
// 				if(err){
// 					console.log(err);
// 				}
// 				else{
// 					campground.comments.push(comment);
// 					campground.save();
// 					res.redirect('/campgrounds/'+campground._id);
// 				}
// 			});
// 		}
// 	});
// 	//create new comments
// 	//connect new comments
// 	// redirect campground show page
	
// });


//AUTH ROUTE
// //show register form
// app.get("/register",function(req,res){
// 	res.render("register");
// });
// //handle sign up logic
// app.post("/register",function(req,res){
// 	var newUser=new User({username:req.body.username});
// 	User.register(newUser,req.body.password,function(err,user){
// 		if(err){
// 			console.log(err);
// 			return res.render("register");
// 		}
// 		passport.authenticate("local")(req,res,function(){
// 			res.redirect("/campgrounds");
// 		});
// 	});
// });
// //show login form
// app.get("/login",function(req,res){
// 	res.render("login");
// });
// //handeling login logic
// app.post("/login",passport.authenticate("local",
// 	{
// 	   successRedirect:"/campgrounds",
// 	failureRedirect:"/login"
// }),function(req,res){
// });
// //logout routes
// app.get("/logout",function(req,res){
// 	req.logout();
// 	res.redirect("/campgrounds");
// });
// function isLoggedIn(req,res,next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	}
// 	res.redirect("/login");
// }
app.use(indexRoutes);
app.use(commentRoutes);
app.use(campgroundRoutes);

app.listen(process.env.PORT,process.env.IP,function(){
	console.log("the yelpcamp server has started!");
});
