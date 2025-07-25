import type { NubeSDK } from "@tiendanube/nube-sdk-types";
import { OrderbumpComponent } from "./components/orderbump";
import type { ProductItem, ProductVariant } from "./types";

export interface Pagination {
	itemsPerPage: number;
	totalPages: number;
	currentPage: number;
}

export type OrderbumpState = {
	products: ProductItem[];
	nube: NubeSDK | null;
	loading: boolean;
	pagination?: Pagination;
};

const state: OrderbumpState = {
	nube: null,
	products: [],
	loading: false,
	pagination: {
		itemsPerPage: 4,
		totalPages: 1,
		currentPage: 0,
	},
};

export function useOrderbumpProducts() {
	return [...state.products];
}

export function useOrderbumpPagination() {
	return state.pagination;
}

export function initializeState(nube: NubeSDK, products: ProductVariant[][]) {
	state.nube = nube;

	state.products = products.map((p) => ({
		variants: p,
		id_product: p[0].id_product,
		selected_variant_id: p[0].id_variant,
	}));

	state.pagination.totalPages = Math.ceil(
		state.products.length / state.pagination.itemsPerPage,
	);
}

function render() {
	state.nube.send("ui:slot:set", () => ({
		ui: {
			slots: {
				after_address_form: <OrderbumpComponent />,
			},
		},
	}));
}

export function updateSelectedVariant(productId: number, variantId: number) {
	const product = state.products.find((p) => p.id_product === productId);
	if (product) {
		product.selected_variant_id = variantId;

		render();
	}
}

export function handleAddToCart(variantId: number) {
	console.log("Adding to cart:", variantId);
}

export function onPreviousPage() {
	if (state.pagination && state.pagination.currentPage > 0) {
		state.pagination.currentPage -= 1;
		render();
	}
}

export function onNextPage() {
	if (
		state.pagination &&
		state.pagination.currentPage < state.pagination.totalPages - 1
	) {
		state.pagination.currentPage += 1;
		render();
	}
}
