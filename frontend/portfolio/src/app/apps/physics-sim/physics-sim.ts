import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { PhysObject } from './classes/phys-object';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
	selector: 'app-physics-sim',
	imports: [MatButtonModule, MatCardModule, MatIconModule],
	templateUrl: './physics-sim.html',
	styleUrl: './physics-sim.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhysicsSim {
	physObjects = signal<PhysObject[]>([]);
    gravityAcceleration: number = 0.11;

	offsetX = 192; // Offset for physics window
	offsetY = 84;

    isPaused = signal(false);

    constructor()
    {
        const objects = [
            new PhysObject({posX: 290, posY: 0, width: 20, height: 40, colour: 'red', bounciness: 0.8}),
            new PhysObject({posX: 220, posY: 300, width: 150, height: 150, colour: 'blue', bounciness: 0.1}),
            new PhysObject({posX: 270, posY: 360, width: 70, height: 70, colour: 'purple', bounciness: 0.5}),

            new PhysObject({posX: 70, posY: 360, width: 70, height: 70, colour: 'orange', shape: "rectangle", bounciness: 0.5}),


            new PhysObject({posX: 0, posY: 600, width: 600, height: 10, colour: 'darkgrey', isStatic: true, shape: "rectangle"})
        ];
        this.physObjects.set(objects);

        setInterval(() => {
            this.simulateTick();
        }, 1);
    }

    simulateTick()
    {
        if (this.isPaused()) return;

        const objects = this.physObjects();
        
        for (let obj of objects.filter(o => !o.isStatic))
        {
            // Update velocities
            obj.velocity.y += this.gravityAcceleration;

            const nextTickPosY = obj.position.y+obj.velocity.y;
            const nextTickPosX = obj.position.x+obj.velocity.x;
            // Check collisions
            for (let otherObj of objects.filter(o => o.id !== obj.id))
            {
                if (otherObj.isInSpace(obj.position.x, nextTickPosY + obj.size.height))
                {
                    // Colliding with the top of another object
					const bounceVel = obj.velocity.y * - obj.bounciness;
                    obj.velocity.y = Math.abs(bounceVel)<0.01 ? 0 : bounceVel; // Reverse and reduce velocity
                    obj.position.y = otherObj.position.y - obj.size.height;
                }
            }

            // Update positions
            obj.position.y += obj.velocity.y;
            obj.position.x += obj.velocity.x;
        }

        this.physObjects.set([...objects]);
    }

	pickupObject(event: MouseEvent, obj: PhysObject)
	{
		const mouseX = event.clientX - this.offsetX;
		const mouseY = event.clientY - this.offsetY;
		const wasStatic = obj.isStatic;

		if (obj.isInSpace(mouseX, mouseY))
		{
			console.log("Picked up object:", obj);
			obj.isStatic = true;
		}

		const mouseMoveListener = (moveEvent: MouseEvent) => {
			const moveX = moveEvent.clientX - this.offsetX;
			const moveY = moveEvent.clientY - this.offsetY;
			obj.position.x = moveX - obj.size.width/2;
			obj.position.y = moveY - obj.size.height/2;
		}
		const mouseUpListener = (upEvent: MouseEvent) => {
			window.removeEventListener('mousemove', mouseMoveListener);
			window.removeEventListener('mouseup', mouseUpListener);
			obj.isStatic = wasStatic;
			console.log("Dropped object:", obj);
		}
		window.addEventListener('mousemove', mouseMoveListener);
		window.addEventListener('mouseup', mouseUpListener);
		this.physObjects.set([...this.physObjects()]);

	}


}