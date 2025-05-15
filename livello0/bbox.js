function BoundingBox(x,y,w,h){
	this.x = x;
	this.y = y;
	this.width = w;
	this.height = h;
	this.Move = function(x,y){
		this.x = x;
		this.y = y;
	}
}
this.Collides = function(b){
	return !(this.x + this.width < b.x || b.x + b.width < this.x ||
  this.y + this.height < b.y || b.y + b.height < this.y);
}

//dx: deltax ,  dy: deltay
this.CollidesAt = function(b, dx, dy){
	return !(this.x + dx + this.width < b.x || b.x + b.width < this.x + dx || this.y + this.height + dy < b.y || b.y + b.height < this.y + dy);
}
this.CollidesPosition = function(b, x, y){
	return !(x + this.width < b.x || b.x + b.width < x || y + this.height < b.y || b.y + b.height < y);
}