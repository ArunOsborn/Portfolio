import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
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
		CommonModule,
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatSlideToggleModule,
		CardEditor,
	],
	templateUrl: './drinkage-settings.html',
	styleUrl: './drinkage-settings.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrinkageSettings {
	readonly data = inject<DrinkageSettingsData>(MAT_DIALOG_DATA);
	private readonly dialogRef = inject<
		MatDialogRef<DrinkageSettings, DrinkageSettingsResult | undefined>
	>(MatDialogRef);

	readonly rawView = signal(false);
	readonly editableGroups = signal(this.buildEditableGroups());
	readonly selectedGroupKey = signal<string | null>(this.editableGroups()[0]?.key ?? null);
	readonly selectedGroup = computed(
		() => this.editableGroups().find(group => group.key === this.selectedGroupKey()) ?? null,
	);

	selectGroup(groupKey: string): void {
		this.selectedGroupKey.set(groupKey);
	}

	updateSelectedText(text: string): void {
		this.updateGroup(this.selectedGroupKey(), group => ({ ...group, editorText: text }));
	}

	updateSelectedTextFromEvent(event: Event): void {
		const target = event.target;
		if (target instanceof HTMLTextAreaElement) {
			this.updateSelectedText(target.value);
		}
	}

	updateChanceFromEvent(event: Event): void {
		const target = event.target;
		if (!(target instanceof HTMLInputElement)) {
			return;
		}

		const value = target.value.trim();
		const chance = value === '' ? null : Number(value);
		this.updateGroup(this.selectedGroupKey(), group => ({
			...group,
			chance: chance === null || !Number.isFinite(chance) ? null : Math.max(0, chance),
		}));
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
		if (groupKey === null) {
			return;
		}

		this.editableGroups.update(groups =>
			groups.map(group => (group.key === groupKey ? updater(group) : group)),
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
