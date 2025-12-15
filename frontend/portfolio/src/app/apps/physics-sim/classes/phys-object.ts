import { Injectable } from '@angular/core';

export class PhysObject {
	id: number = Math.floor(Math.random()*1e9);

	position: { x: number, y: number} = { x: 0, y: 0 };
	size: { width: number, height: number} = { width: 0, height: 0 };
	velocity: { x: number, y: number} = { x: 0, y: 0 };
	
	colour: string;
	isStatic: boolean = false;
	shape: "rectangle" | "circle" = "circle";

	constructor({posX=0, posY=0, width=10, height=10, colour="red", isStatic=false, shape="circle"}:{posX?: number, posY?: number, width?: number, height?: number, colour?: string, isStatic?: boolean, shape?: "rectangle" | "circle"})
	{
		this.position.x = posX;
		this.position.y = posY;
		this.size.width = width;
		this.size.height = height;
		this.colour = colour;
		this.isStatic = isStatic;
		this.shape = shape;
	}

	isInSpace(posX: number, posY: number): boolean
	{
		return (
			posX>this.position.x && posX < this.position.x+this.size.width
		) &&
		(
			posY>this.position.y && posY < this.position.y+this.size.height
		);
	}
}
