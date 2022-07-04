import { parseISO, format } from "date-fns";

interface Date {
  dateString: string;
}

export default function Date({ dateString }: Date) {
  const date = parseISO(dateString);
  return <time dateTime={dateString}>{format(date, "LLLL d, yyyy")}</time>;
}
