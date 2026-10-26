import { ANDROID_APK_URL } from "@revolt/common/lib/links";
import { useState } from "@revolt/state";
import { Button, Text } from "@revolt/ui";
import { Show, createSignal } from "solid-js";
import { styled } from "styled-system/jsx";
import AndroidPromo from "../public/assets/inapp-promotion/web/android-phone.png";

/**
 * Section ID used to persist permanent dismissal of the nag screen
 */
const ANDROID_NAG_DISMISS_KEY = "android-nag-dismissed";

/**
 * Whether the current device is running Android or iOS
 */
const isAndroid = () => /android/i.test(navigator.userAgent);
const isIos = () => /iphone|ipad|ipod/i.test(navigator.userAgent);

/**
 * Whether the origin of the request makes us eligible to show the nag screen
 */
const isEligibleOrigin = () => {
  const { hostname } = window.location;
  return (
    hostname === "localhost" ||
    hostname.endsWith(".stoat.chat") ||
    hostname === "stoat.chat" ||
    hostname.endsWith(".fanya.su") ||
    hostname === "stoat.fanya.su"
  );
};

/**
 * Full screen nag encouraging mobile users or informing iOS users
 */
export function AndroidNag() {
  const state = useState();

  const [dismissedThisSession, setDismissedThisSession] = createSignal(false);

  const permanentlyDismissed = () =>
    state.layout.getSectionState(ANDROID_NAG_DISMISS_KEY, false);

  const show = () =>
    (isAndroid() || isIos()) &&
    isEligibleOrigin() &&
    !dismissedThisSession() &&
    !permanentlyDismissed();

  return (
    <Show when={show()}>
      <Base>
        <Hero>
          <img src={AndroidPromo} alt="Stoat Mobile" />

          <Heading>
            <Text class="headline" size="large">
              {isIos()
                ? "Приложение для iOS не поддерживается"
                : "Stoat работает лучше в приложении"}
            </Text>
          </Heading>

          <Copy>
            <Text class="body" size="large">
              {isIos()
                ? "Нативное приложение для iPhone и iPad пока недоступно."
                : "Для максимальной скорости, фоновых push-уведомлений и стабильных звонков установите наше приложение."}
            </Text>

            <Text class="body" size="large">
              {isIos()
                ? "Вы можете полноценно использовать Stoat в браузере Safari или добавить иконку на экран «Домой» (PWA)."
                : "Скачайте установочный APK-файл приложения и оставайтесь на связи всегда."}
            </Text>
          </Copy>
        </Hero>

        <Footer>
          {isIos() ? (
            <Button
              variant="filled"
              onPress={() => setDismissedThisSession(true)}
            >
              Открыть веб-версию
            </Button>
          ) : (
            <>
              <Button
                variant="filled"
                onPress={() => {
                  window.location.href = ANDROID_APK_URL;
                }}
              >
                Скачать Stoat (.apk)
              </Button>

              <Button
                variant="text"
                onPress={() => setDismissedThisSession(true)}
              >
                Продолжить в браузере
              </Button>
            </>
          )}

          <DismissLink
            onClick={() => {
              state.layout.setSectionState(ANDROID_NAG_DISMISS_KEY, true);
              setDismissedThisSession(true);
            }}
          >
            Больше не показывать
          </DismissLink>
        </Footer>
      </Base>
    </Show>
  );
}

/**
 * Full screen container that sits above all other UI
 */
const Base = styled("div", {
  base: {
    position: "fixed",
    inset: 0,
    zIndex: "9999",

    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    textAlign: "center",
    padding: "var(--gap-xl) var(--gap-lg)",
    userSelect: "none",
    overflowY: "auto",

    color: "var(--md-sys-color-on-surface)",
    background: "var(--md-sys-color-surface)",
  },
});

/**
 * Hero region: large image and supporting copy, centred above the actions
 */
const Hero = styled("div", {
  base: {
    flex: "1",

    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "var(--gap-md)",

    "& img": {
      width: "min(60vw, 240px)",
      height: "auto",
      marginBottom: "var(--gap-md)",
    },
  },
});

/**
 * Headline, balanced so it doesn't leave a single orphan word on its own line
 */
const Heading = styled("div", {
  base: {
    textWrap: "balance",
  },
});

/**
 * Body copy, width-constrained and padded for readability
 */
const Copy = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--gap-md)",

    maxWidth: "42ch",
    paddingInline: "var(--gap-lg)",
    textWrap: "balance",
    color: "var(--md-sys-color-on-surface-variant)",
  },
});

/**
 * Actions pinned to the bottom of the screen
 */
const Footer = styled("div", {
  base: {
    flexShrink: 0,

    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    width: "100%",
    maxWidth: "360px",
    gap: "var(--gap-md)",
    paddingTop: "var(--gap-lg)",
  },
});

/**
 * De-emphasised control for permanently dismissing the nag screen
 */
const DismissLink = styled("button", {
  base: {
    appearance: "none",
    background: "none",
    border: "none",
    cursor: "pointer",

    marginTop: "var(--gap-sm)",
    padding: "var(--gap-sm)",

    font: "inherit",
    fontSize: "0.8125rem",
    color: "var(--md-sys-color-on-surface-variant)",
    textDecoration: "underline",
    textUnderlineOffset: "2px",

    _hover: {
      color: "var(--md-sys-color-on-surface)",
    },
  },
});
