import {
	Box,
	Button,
	Fragment,
	Image,
	Select,
	Text,
} from "@tiendanube/nube-sdk-jsx";
import {
	handleAddToCart,
	onNextPage,
	onPreviousPage,
	updateSelectedVariant,
	useOrderbumpPagination,
	useOrderbumpProducts,
} from "../state";
import type { ProductItem, ProductVariant } from "../types";
import { orderbumpStyles as styles } from "./orderbump.styles";
import { DesktopContainer, MobileContainer, MobileList } from "./ui/common";

export const ProductItemComponent = ({
	product,
	onVariantChange,
	onAddToCart,
}: {
	product: ProductItem;
	onVariantChange: (productId: number, variantId: number) => void;
	onAddToCart: () => void;
}) => {
	const lang = "pt";

	const selectedVariant = product.variants.find(
		(variant) => variant.id_variant === product.selected_variant_id,
	);

	const allAttrs = product.variants.reduce(
		(acc, item) => {
			const itemAttrs = JSON.parse(item.attributes || "[]");
			for (const attr of itemAttrs) {
				if (
					!acc.some((a: { [key: string]: string }) => a[lang] === attr[lang])
				) {
					acc.push(attr);
				}
			}
			return acc;
		},
		[] as { [key: string]: string }[],
	);

	let pricing = null;

	if (selectedVariant?.promotional_price && selectedVariant?.price !== 0) {
		pricing = (
			<>
				<Text style={styles.listItemSellingPrice}>
					{formatPrice(selectedVariant.promotional_price)}
				</Text>
				<Text style={styles.listItemListPrice}>
					{formatPrice(selectedVariant.price)}
				</Text>
			</>
		);
	} else if (
		selectedVariant?.price === 0 &&
		!selectedVariant?.promotional_price
	) {
		pricing = <Text style={styles.listItemListPrice}>Grátis</Text>;
	} else {
		pricing = (
			<Text style={styles.listItemSellingPrice}>
				{formatPrice(
					selectedVariant?.price || selectedVariant?.promotional_price || 0,
				)}
			</Text>
		);
	}

	const findVariantByValues = (attributeValues: Record<string, string>) => {
		return product.variants.find((variant) => {
			const attributes = JSON.parse(variant?.attributes || "[]");
			const values = JSON.parse(variant?.values || "[]"); // Usar os values da variant atual, não da selectedVariant

			return attributes?.every(
				(attr: Record<string, string>, index: number) => {
					const attrName: string = attr[lang];
					const variantValue: string = values[index]?.[lang];
					return attributeValues[attrName] === variantValue;
				},
			);
		});
	};

	const handleVariantChange = (attributeName: string, value: string) => {
		// Construir os valores atuais mantendo todas as seleções anteriores
		const currentValues: Record<string, string> = {};

		const attributes = JSON.parse(selectedVariant?.attributes || "[]");
		const values = JSON.parse(selectedVariant?.values || "[]");

		attributes?.forEach((attr: { [key: string]: string }, index: number) => {
			const attrName: string = attr[lang];
			currentValues[attrName] = (values[index]?.[lang] as string) || "";
		});

		currentValues[attributeName] = value;
		let newVariant = findVariantByValues(currentValues);
		if (!newVariant) {
			const updatedAttributes = attributes?.map(
				(attr: { [key: string]: string }) => attr,
			);
			const updatedValues = values?.map(
				(val: { [key: string]: string }, index: number) => {
					const attrName = attributes[index]?.[lang];
					if (attrName === attributeName) {
						return { [lang]: value };
					}
					return val;
				},
			);

			newVariant = {
				...selectedVariant,
				stock: "0",
				attributes: JSON.stringify(updatedAttributes),
				values: JSON.stringify(updatedValues),
				id_variant: selectedVariant?.id_variant || 0,
			} as ProductVariant;
		}

		if (newVariant) {
			onVariantChange(selectedVariant?.id_product || 0, newVariant.id_variant);
		}
	};

	return (
		<Box style={styles.listItem}>
			<Image
				src={selectedVariant?.image || "https://placehold.co/94x130"}
				alt={selectedVariant?.name || "Product Image"}
				style={styles.listItemImage}
			/>
			<Box style={styles.listItemInfo}>
				<Text style={styles.listItemTitle}>{selectedVariant?.name}</Text>
				<Box style={styles.listItemPriceContainer}>{pricing}</Box>
				<Box style={styles.listItemVariantContainer}>
					{allAttrs?.map((attr, index) => {
						const values = JSON.parse(selectedVariant?.values || "[]");
						const attrName = attr[lang];
						const options = product.variants
							?.map((variant) => JSON.parse(variant.values)[index][lang])
							.filter((v, i, arr) => arr.indexOf(v) === i);
						const selectedValue = values[index]?.[lang] || "";

						return (
							<Box margin={0} style={styles.listItemVariantSelectColumn}>
								<Text style={styles.listItemVariantSelectText}>{attrName}</Text>
								<Select
									style={{
										label: styles.listItemVariantSelectLabel,
										select: styles.listItemVariantSelect,
									}}
									id={`variant-select-${attrName}-${index}`}
									name={attrName}
									label=""
									value={selectedValue || ""}
									options={[
										...(options || []).map((value) => ({
											value: value,
											label: value,
										})),
									]}
									onChange={(e) => {
										handleVariantChange(attrName, e.value || "");
									}}
								/>
							</Box>
						);
					})}
				</Box>
				<Button
					style={styles.listItemAddToCartButton}
					disabled={selectedVariant?.stock === "0"}
					onClick={onAddToCart}
				>
					{`${selectedVariant?.stock === "0" ? "Sem estoque" : "Adicionar ao carrinho"}`}
				</Button>
			</Box>
		</Box>
	);
};

export function OrderbumpComponent() {
	const products = useOrderbumpProducts();
	const { currentPage, itemsPerPage, totalPages } = useOrderbumpPagination();
	const start = currentPage * itemsPerPage;
	const end = start + itemsPerPage + 1;
	const visibleBlocks = products.slice(start, end);

	const handleVariantChange = (productId: number, variantId: number) => {
		updateSelectedVariant(productId, variantId);
	};

	return (
		<Fragment>
			<MobileContainer>
				<Box style={styles.header}>
					<Text style={styles.headerTitle}>
						Mais opções que combinam com seu gosto 😍
					</Text>
				</Box>
				<MobileList>
					{products.map((block) => (
						<Fragment>
							<ProductItemComponent
								product={block}
								onVariantChange={handleVariantChange}
								onAddToCart={() => handleAddToCart(block.selected_variant_id)}
							/>
						</Fragment>
					))}
				</MobileList>
			</MobileContainer>

			<DesktopContainer>
				<Box style={styles.header}>
					<Text style={styles.headerTitle}>
						Você tem ofertas disponíveis! ☺️
					</Text>
					<Box style={styles.headerActions}>
						<Button
							style={styles.headerActionButtonPrev}
							disabled={currentPage === 0}
							onClick={onPreviousPage}
						/>
						<Text style={styles.pageIndicator}>
							{`${currentPage + 1} de ${totalPages}`}
						</Text>
						<Button
							style={styles.headerActionButtonNext}
							disabled={currentPage + 1 >= totalPages}
							onClick={onNextPage}
						/>
					</Box>
				</Box>
				<Box style={styles.list}>
					{visibleBlocks.map((block) => (
						<Fragment>
							<ProductItemComponent
								product={block}
								onVariantChange={handleVariantChange}
								onAddToCart={() => handleAddToCart(block.selected_variant_id)}
							/>
						</Fragment>
					))}
				</Box>
			</DesktopContainer>
		</Fragment>
	);
}

function formatPrice(value: number, lang = "pt") {
	if (!value) value = 0;

	const currencyOptions = {
		pt: {
			locale: "pt-BR",
			currency: "BRL",
		},
		es: {
			locale: "es-CO",
			currency: "COP",
		},
	};

	const options =
		currencyOptions[lang as keyof typeof currencyOptions] || currencyOptions.es;

	const convert = new Intl.NumberFormat(options.locale, {
		style: "currency",
		currency: options.currency,
	});

	return convert.format(value);
}
