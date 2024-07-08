import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default function Component() {
 return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Connect your Telegram Account</CardTitle>
        <CardDescription>Enter your Telegram session string to connect your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={async (formData: FormData) => {
          "use server"
          const sessionString = formData.get('tgSession')
          if (!sessionString) throw new Error('Error Occured')
          cookies().set('tgSession', sessionString as string)

          redirect('/')

        }} className="space-y-4">
          <Input type="text" name="tgSession" placeholder="Telegram session string" aria-label="Telegram session string" required />
          <Button type="submit" className="w-full">
            Connect
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}