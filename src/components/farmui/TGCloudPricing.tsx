import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { initailizePayment } from "@/actions";
import { errorToast } from "@/lib/notify";

export default function Component() {
  const router = useRouter();
  return (
    <Card className="w-full max-w-md bg-primary text-primary-foreground">
      <CardHeader className="space-y-2">
        <CardTitle className="text-3xl font-bold">Pro</CardTitle>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold">$9</span>
          <span className="text-lg font-medium text-muted-foreground">/mo</span>
        </div>
        <CardDescription>Unlimited storage for you</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center gap-2">
            <CheckIcon className="h-5 w-5 fill-primary-foreground" />
            <span>Unlimited storage</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckIcon className="h-5 w-5 fill-primary-foreground" />
            <span>Advanced collaboration tools</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckIcon className="h-5 w-5 fill-primary-foreground" />
            <span>Dedicated support</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={async () => {
            const data = await initailizePayment({
              amount: "150",
              currency: "ETB",
            });

            if (data?.status == "success") {
              router.push(data.data.checkout_url);
              return;
            }
            errorToast(data?.message ?? "failed to process ayment");
          }}
          variant="secondary"
          className="w-full"
        >
          Get Pro
        </Button>
      </CardFooter>
    </Card>
  );
}

function CheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
