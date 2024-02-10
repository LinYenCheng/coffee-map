import { Rating } from 'primereact/rating';

type Props = { num: number };

export default function Stars({ num }: Props) {
  return <Rating value={num} readOnly cancel={false} />;
}
