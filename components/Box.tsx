import type { ReactNode, ElementType, HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLElement> & { children: ReactNode; as?: ElementType; "data-light"?: boolean };

export default function Box({ children, as: Tag = "div", ...rest }: Props) {
  return <Tag {...rest}>{children}</Tag>;
}
