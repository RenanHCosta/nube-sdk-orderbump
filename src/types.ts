export type ProductVariant = {
	type: string;
	hidden_in_cart: number;
	id_order: number;
	id_sale: number;
	name: string;
	attributes: string; // JSON string of attributes ("[]")
	id_product: number;
	handle: string;
	price: number;
	promotional_price?: number;
	stock: string;
	image: string;
	values: string; // JSON string of values ("[]")
	id_variant: number;
};

export type OrderbumpItem = {
	[key: string]: ProductVariant[];
};

export type ProductItem = {
	variants: ProductVariant[];
	id_product: number;
	selected_variant_id: number;
};
