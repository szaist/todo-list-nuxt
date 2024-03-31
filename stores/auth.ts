import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", () => {
  const token = useCookie("authorization_token", {
    maxAge: 3600,
  });

  const authToken = computed(() => token.value ?? "");

  const setToken = (newToken: string) => {
    token.value = newToken;
  };

  return { authToken, setToken };
});
