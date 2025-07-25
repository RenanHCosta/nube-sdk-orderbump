import { Button, Icon, Text } from "@tiendanube/nube-sdk-jsx";
import { styled } from "@tiendanube/nube-sdk-ui";

export type AddToCartButtonProps = {
	id: string;
	onClick: () => void;
};

const StyledButton = styled(Button)`
	display: flex;
  justify-content: center;
  align-items: center;
`;

export function AddToCartButton(props: AddToCartButtonProps) {
	return (
		<StyledButton id={props.id} onClick={props.onClick}>
			<Icon name="shopping-cart" />
			<Text inline>Adicionar ao Carrinho</Text>
		</StyledButton>
	);
}
