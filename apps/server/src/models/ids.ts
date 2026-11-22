export type EntryId = string & { readonly __brand: "Entry" };
export type SectionId = string & { readonly __brand: "Section" };
export type FranchiseId = string & { readonly __brand: "Franchise" };

// No I, L, O, U — avoids visual confusion with 1/0.
const CROCKFORD_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

function randomSuffix(length = 16): string {
	const bytes = new Uint8Array(length);
	crypto.getRandomValues(bytes);

	let result = "";
	for (const byte of bytes) {
		// 32 divides 256 evenly, so `& 31` stays uniform; `%` would not for a non-power-of-two alphabet.
		result += CROCKFORD_ALPHABET[byte & 31];
	}
	return result;
}

// 80 bits of entropy per id makes a collision practically impossible, but this is a cheap safety net
// (mirrors the old uuidv4-based generator, which looped the same way against existing ids).
function uniqueId<T extends string>(prefix: string, existingIds?: Iterable<string>): T {
	const existing = existingIds ? new Set(existingIds) : null;
	let id: string;
	do {
		id = `${prefix}${randomSuffix()}`;
	} while (existing?.has(id));
	return id as T;
}

export function newEntryId(existingIds?: Iterable<string>): EntryId {
	return uniqueId<EntryId>("ent_", existingIds);
}

export function newSectionId(existingIds?: Iterable<string>): SectionId {
	return uniqueId<SectionId>("sec_", existingIds);
}

export function newFranchiseId(existingIds?: Iterable<string>): FranchiseId {
	return uniqueId<FranchiseId>("fr_", existingIds);
}

export function systemSectionId(slug: string): SectionId {
	return `sec_sys_${slug}` as SectionId;
}

export function asEntryId(raw: string): EntryId {
	return raw as EntryId;
}

export function asSectionId(raw: string): SectionId {
	return raw as SectionId;
}

export function asFranchiseId(raw: string): FranchiseId {
	return raw as FranchiseId;
}
