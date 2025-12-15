import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { PhysObject } from './classes/phys-object';
import { MatButtonModule } from '@angular/material/button';

@Component({
	selector: 'app-physics-sim',
	imports: [MatButtonModule],
	templateUrl: './physics-sim.html',
	styleUrl: './physics-sim.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhysicsSim {
	physObjects = signal<PhysObject[]>([]);
    gravityAcceleration: number = 0.01;

    isPaused = signal(false);

    constructor()
    {
        const objects = [
            new PhysObject({posX: 10, posY: 10, width: 20, height: 40, colour: 'red'}),
            new PhysObject({posX: 200, posY: 200, width: 150, height: 150, colour: 'blue'}),
            new PhysObject({posX: 0, posY: 600, width: 600, height: 10, colour: 'darkgrey', isStatic: true, shape: "rectangle"})
        ];
        this.physObjects.set(objects);

        setInterval(() => {
            this.simulateTick();
        }, 10);
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
                    obj.velocity.y = 0;
                    obj.position.y = otherObj.position.y - obj.size.height;
                }
            }

            // Update positions
            obj.position.y += obj.velocity.y;
            obj.position.x += obj.velocity.x;
        }

        this.physObjects.set([...objects]);
    }
}
