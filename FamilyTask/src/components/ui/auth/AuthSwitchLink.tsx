import { Pressable} from "react-native";
import { Href, router } from "expo-router";
import { Typo } from "../Typo";

type Props = {
  text: string;
  linkText: string;
  href: Href;
};

export function AuthSwitchLink({ text, linkText, href }: Props) {
  return (
    <Pressable
      onPress={() => router.push(href)}
      className="flex-row justify-center mt-6"
    >
      <Typo variant='h3' className="text-muted">
        {text}{" "}
      </Typo>

      <Typo variant='h3' className="text-primary">
        {linkText}
      </Typo>
    </Pressable>
  );
}