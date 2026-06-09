import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CardGroup } from '../drinkage-card-pack/drinkage-card-pack';
import { CardEditor } from './card-editor/card-editor';

interface DrinkageSettingsData {
	categories: Record<string, CardGroup>;
	punishments: string[];
}

interface EditableCardGroup {
	key: string;
	label: string;
	kind: 'category' | 'punishments';
	chance: number | null;
	allowRepeats: boolean;
	editorText: string;
}

export interface DrinkageSettingsResult {
	categories: Record<string, CardGroup>;
	punishments: string[];
}

@Component({
	selector: 'app-drinkage-settings',
	imports: [
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule,
		MatSlideToggleModule,
		CommonModule,
		CardEditor
	],
	templateUrl: './drinkage-settings.html',
	styleUrl: './drinkage-settings.scss',
})
export class DrinkageSettings {
	readonly data = inject<DrinkageSettingsData>(MAT_DIALOG_DATA);
	private readonly dialogRef = inject(MatDialogRef<DrinkageSettings, DrinkageSettingsResult>);
	rawView: boolean = false;

	readonly editableGroups = signal<EditableCardGroup[]>(this.buildEditableGroups());
	readonly selectedGroupKey = signal<string | null>(this.editableGroups()[0]?.key ?? null);
	readonly selectedGroup = computed(
		() => this.editableGroups().find(group => group.key === this.selectedGroupKey()) ?? null
	);
	readonly hasSelection = computed(() => this.selectedGroup() !== null);

	selectGroup(groupKey: string): void {
		this.selectedGroupKey.set(groupKey);
	}

	updateSelectedTextFromEvent(event: Event|string): void {
		if (typeof event === "string")
		{
			this.updateSelectedText(event);
		}
		else
		{
			const target = event.target as HTMLTextAreaElement | null;
			this.updateSelectedText(target?.value ?? '');
		}
	}

	updateSelectedText(text: string): void {
		this.updateGroup(this.selectedGroupKey(), group => ({ ...group, editorText: text }));
	}

	updateChanceFromEvent(event: Event): void {
		const target = event.target as HTMLInputElement | null;
		this.updateChance(target?.value ?? '0');
	}

	updateChance(value: string): void {
		const chance = Number(value);
		this.updateGroup(this.selectedGroupKey(), group => ({
			...group,
			chance: Number.isFinite(chance) ? Math.max(0, chance) : 0,
		}));
	}

	updateAllowRepeatsFromEvent(event: Event): void {
		const target = event.target as HTMLInputElement | null;
		this.updateAllowRepeats(target?.checked ?? false);
	}

	updateAllowRepeats(allowRepeats: boolean): void {
		this.updateGroup(this.selectedGroupKey(), group => ({ ...group, allowRepeats }));
	}

	cardCount(group: EditableCardGroup): number {
		return this.parseEditorText(group.editorText).length;
	}

	cancel(): void {
		this.dialogRef.close();
	}

	save(): void {
		const categories: Record<string, CardGroup> = {};
		let punishments: string[] = [];

		for (const group of this.editableGroups()) {
			const cards = this.parseEditorText(group.editorText);

			if (group.kind === 'punishments') {
				punishments = cards;
				continue;
			}

			categories[group.key] = {
				chance: group.chance ?? 0,
				allowRepeats: group.allowRepeats,
				cards,
			};
		}

		this.dialogRef.close({ categories, punishments });
	}

	private buildEditableGroups(): EditableCardGroup[] {
		const categoryGroups = Object.entries(this.data.categories).map(([key, group]) => ({
			key,
			label: this.formatGroupLabel(key),
			kind: 'category' as const,
			chance: group.chance,
			allowRepeats: group.allowRepeats,
			editorText: group.cards.join('\n'),
		}));

		return [
			...categoryGroups,
			{
				key: 'punishments',
				label: 'Punishments',
				kind: 'punishments',
				chance: null,
				allowRepeats: true,
				editorText: this.data.punishments.join('\n'),
			},
		];
	}

	private updateGroup(
		groupKey: string | null,
		updater: (group: EditableCardGroup) => EditableCardGroup,
	): void {
		if (!groupKey) {
			return;
		}

		this.editableGroups.update(groups =>
			groups.map(group => (group.key === groupKey ? updater(group) : group))
		);
	}

	private parseEditorText(text: string): string[] {
		return text
			.split(/\r?\n/g)
			.map(line => line.trim())
			.filter(line => line.length > 0);
	}

	private formatGroupLabel(value: string): string {
		return value
			.replace(/[-_]+/g, ' ')
			.replace(/\b\w/g, letter => letter.toUpperCase());
	}

}
