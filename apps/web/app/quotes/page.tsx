import { Button } from "@workspace/ui/components/button";
import Link from "next/link";

export default function QuotesPage() {
  return (
    <div>
      <Button asChild>
        <Link href="quotes/new">
          New quote
        </Link>
      </Button>
    </div>
  )
}
