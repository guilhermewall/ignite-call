import { ArrowRight } from "phosphor-react";
import { Container, Header, Form, FormError } from "./styles";
import { Heading, MultiStep, Text, TextInput, Button } from "@ignite-ui/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { api } from "@/lib/axios";
import { AxiosError } from "axios";

const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, "O usuario precisa ter pelo menos 3 letras.")
    .regex(/^([a-z\\-]+)$/i, {
      message: "O usuário pode ter apenas letras e hífens.",
    })
    .transform((username) => username.toLowerCase()),

  name: z.string().min(3, "O nome precisa ter pelo menos 3 letras."),
});

type RegisterFormData = z.infer<typeof registerFormSchema>;

export default function Register() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  });

  const router = useRouter();

  useEffect(() => {
    if (router.query.username) {
      setValue("username", String(router.query.username));
    }
  }, [router.query?.username, setValue]);

  async function handleRegister(data: RegisterFormData) {
    try {
      await api.post("/users", {
        name: data.name,
        username: data.username,
      });

      await router.push("/register/connect-calendar");
    } catch (error) {
      if (error instanceof AxiosError && error?.response?.data?.message) {
        alert(error.response.data.message);
        return;
      }

      console.log(error);
    }
  }

  return (
    <Container>
      <Header>
        <Heading as="strong">Bem-vindo ao Ignite Call!</Heading>
        <Text>
          Precisamos de algumas informações para criar seu perfil! Ah, você pode
          editar essas informações depois.
        </Text>

        <MultiStep size={4} currentStep={1} />
      </Header>

      <Form as="form" onSubmit={handleSubmit(handleRegister)}>
        <label>
          <Text size="sm">Nome de usuário</Text>
          <TextInput
            prefix="ignite.com/"
            placeholder="seu-usuário"
            crossOrigin={undefined}
            {...register("username")}
          />

          {errors.username && <FormError>{errors.username.message}</FormError>}
        </label>

        <label>
          <Text size="sm">Nome completo</Text>
          <TextInput
            placeholder="Seu nome"
            crossOrigin={undefined}
            {...register("name")}
          />

          {errors.name && <FormError>{errors.name.message}</FormError>}
        </label>

        <Button type="submit" disabled={isSubmitting}>
          Próximo passo
          <ArrowRight />
        </Button>
      </Form>
    </Container>
  );
}
