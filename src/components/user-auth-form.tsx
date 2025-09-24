
"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form"
import { useAuth } from "@/context/auth-context"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  formType: "login" | "signup";
}

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
})

const signupSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long." }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
})

export function UserAuthForm({ className, formType, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const router = useRouter();
  const { login } = useAuth();

  const schema = formType === 'login' ? loginSchema : signupSchema;
  type FormValues = z.infer<typeof schema>;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: formType === 'login' 
      ? { email: "", password: "" } 
      // @ts-ignore
      : { email: "", password: "", confirmPassword: "" },
  })

  async function onSubmit(data: FormValues) {
    setIsLoading(true)
    // This is a mock API call to simulate network latency.
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Use the mock login function from our auth context
    login(data.email);
    
    setIsLoading(false)

    toast({
      title: formType === 'login' ? "Login Successful" : "Account Created",
      description: formType === 'login' ? "Welcome back!" : "You have been successfully signed up.",
    })
    
    // Redirect to the home page on successful login/signup
    router.push('/');
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Label>Email</Label>
                <FormControl>
                  <Input 
                    placeholder="name@example.com" 
                    type="email" 
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading}
                    {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            // @ts-ignore
            name="password"
            render={({ field }) => (
              <FormItem>
                <Label>Password</Label>
                <FormControl>
                  <Input 
                    type="password"
                    disabled={isLoading}
                    {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {formType === 'signup' && (
             <FormField
                control={form.control}
                // @ts-ignore
                name="confirmPassword"
                render={({ field }) => (
                <FormItem>
                    <Label>Confirm Password</Label>
                    <FormControl>
                    <Input
                        type="password"
                        disabled={isLoading}
                        {...field}
                    />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
          )}
          <Button disabled={isLoading} className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {formType === 'login' ? "Login" : "Create account"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
