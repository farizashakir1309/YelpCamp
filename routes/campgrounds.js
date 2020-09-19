var express=require("express");
var router=express.Router();
var Campground=require("../models/campground");
router.get("/campgrounds",function(req,res){
	
	Campground.find({},function(err,allcampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index",{campgrounds:allcampgrounds});
		}
	});
	//res.render("campgrounds",{campgrounds:campgrounds});
});

//CREATE -add new campground to DB
router.post("/campgrounds",isLoggedIn,function(req,res){
	var name=req.body.name;
	var image=req.body.image;
	var desc=req.body.description;
	var author={
		id:req.user._id,
		username:req.user.username
	}
	var newCampground={name: name,image: image,description: desc,author:author}
	Campground.create(newCampground,function(err,newlyCreated){
		if(err){
			console.log(err);
		}else{
			res.redirect("/campgrounds");
		}
	});
	
});
//NEW -show form to create new campground
router.get("/campgrounds/new",isLoggedIn,function(req, res){
	res.render("campgrounds/new");
});
//show-shows more info about campgrounds
router.get("/campgrounds/:id",function(req , res){
//find campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
		if(err){
			console.log(err);
		}else{
			//render show template with that campground
			console.log(foundCampground);
			res.render("campgrounds/show",{campground:foundCampground});
		}
	});
	//req.params.id
	//res.render("show");
});



//edit campground route
// router.get("/campgrounds/:id/edit",function(req,res){
// 	Campground.findById(req.params.id,function(err,foundCampground){
// 	if(err){
// 		res.redirect("/campgrounds");
// 	}else{
// 		res.render("campgrounds/edit",{campground:foundCampground});
// 	}	
// 	});
// });

router.get("/campgrounds/:id/edit",checkCampgroundOwnership,function(req,res){ 
	//is user logged in 
Campground.findById(req.params.id,function(err,foundCampground){
	
		res.render("campgrounds/edit",{campground:foundCampground});
	
});

});


//update campground route
router.put("/campgrounds/:id",checkCampgroundOwnership,function(req,res){
	//find ans update the correct campgrounds
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
		if(err){
			res.redirect("/campgrounds");
			
		}else{
			res.redirect("/campgrounds/"+req.params.id)
		}
	});
});


//destroy campground route
router.delete("/campgrounds/:id",checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds");
		}
	});
});

//middleware

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error"," You need to be logged in to do that ");
	res.redirect("/login");
}
function checkCampgroundOwnership(req,res,next){
	if(req.isAuthenticated()){
	Campground.findById(req.params.id,function(err,foundCampground){
	if(err){
		req.flash("error"," Campground not found ");
		res.redirect("back");
	}else{
		//does usr own the campgrounds?
		if(foundCampground.author.id.equals(req.user._id)){
		next();
	}else{
		req.flash("error"," You dont have permission to do that ");
		res.redirect("back");
	}
	}
});
}else{
	req.flash("error"," You need to be logged in to do that ");
	res.redirect("back");
}	

}
module.exports=router;
