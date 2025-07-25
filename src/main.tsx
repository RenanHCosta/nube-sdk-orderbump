import type { NubeSDK } from "@tiendanube/nube-sdk-types";
import { getProducts } from "./api";
import { OrderbumpComponent } from "./components/orderbump";
import { initializeState } from "./state";

export async function App(nube: NubeSDK) {
	const items = await getProducts();
	const products = Object.values(items);

	if (!products?.length) return;

	initializeState(nube, products);

	nube.send("ui:slot:set", () => ({
		ui: {
			slots: {
				after_address_form: <OrderbumpComponent />,
			},
		},
	}));
}
