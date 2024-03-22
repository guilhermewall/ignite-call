import { Button, TextInput, Text } from "@ignite-ui/react";
import { ArrowRight } from "phosphor-react";
import { Form, FormAnnotation } from "./styles";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";

const claimUsernameFormSchema = z.object({
  username: z
    .string()
    .min(3, "O usuario precisa ter pelo menos 3 letras.")
    .regex(/^([a-z\\-]+)$/i, {
      message: "O usuário pode ter apenas letras e hífens.",
    })
    .transform((username) => username.toLowerCase()),
});

type ClaimUsernameFormData = z.infer<typeof claimUsernameFormSchema>;

export function ClaimUsernameForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClaimUsernameFormData>({
    resolver: zodResolver(claimUsernameFormSchema),
  });

  const router = useRouter();

  const handleClaimUsername = async (data: ClaimUsernameFormData) => {
    const { username } = data;

    await router.push(`/register?username=${username}`);
  };

  return (
    <>
      <Form onSubmit={handleSubmit(handleClaimUsername)}>
        <TextInput
          size={"sm"}
          prefix="ignite.com/"
          placeholder="seu usuario"
          crossOrigin={undefined}
          {...register("username")}
        />
        <Button size={"sm"} type="submit">
          Reservar
          <ArrowRight />
        </Button>
      </Form>
      <FormAnnotation>
        <Text size="sm">
          {errors.username
            ? errors.username.message
            : "Digite o nome do usuario desejado"}
        </Text>
      </FormAnnotation>
    </>
  );
}
