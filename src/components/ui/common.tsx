import { Box } from "@tiendanube/nube-sdk-jsx";
import { styled } from "@tiendanube/nube-sdk-ui";

export const MobileContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;

  @media (min-width: 768px) {
    display: none;
  }
`;

export const DesktopContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;

  @media (max-width: 767px) {
    display: none;
  }
`;

export const MobileList = styled(Box)`
  display: flex;
  overflow-x: auto;
  gap: 10px;
  scrollbar-width: none;
  scroll-snap-type: x mandatory;
`;
