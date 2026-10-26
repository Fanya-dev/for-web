import { JSX, createMemo, createSignal, onMount } from "solid-js";
import { A, useNavigate } from "@revolt/routing";
import { styled } from "styled-system/jsx";
import { css } from "styled-system/css";
import { Button, iconSize } from "@revolt/ui";
import { Symbol } from "@revolt/ui/components/utils/Symbol";

import Wordmark from "../public/assets/web/wordmark.svg?component-solid";

const Container = styled("div", {
  base: {
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "var(--md-sys-color-surface)",
    color: "var(--md-sys-color-on-surface)",
    boxSizing: "border-box",
    overflowY: "auto",
  },
});

const Header = styled("header", {
  base: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
    maxWidth: "1200px",
    width: "100%",
    margin: "0 auto",
    boxSizing: "border-box",
  },
});

const LogoGroup = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    "& svg": {
      height: "32px",
      width: "auto",
      color: "var(--md-sys-color-primary)",
    },
  },
});

const Hero = styled("main", {
  base: {
    maxWidth: "960px",
    width: "100%",
    margin: "0 auto",
    padding: "48px 24px 32px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxSizing: "border-box",
  },
});

const Title = styled("h1", {
  base: {
    fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
    fontWeight: 800,
    lineHeight: 1.15,
    margin: "0 0 16px",
    letterSpacing: "-0.02em",
  },
});

const Subtitle = styled("p", {
  base: {
    fontSize: "clamp(1.05rem, 2vw, 1.35rem)",
    color: "var(--md-sys-color-on-surface-variant)",
    maxWidth: "680px",
    lineHeight: 1.5,
    margin: "0 0 36px",
  },
});

const ActionsRow = styled("div", {
  base: {
    display: "flex",
    flexWrap: "wrap",
    gap: "16px",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "24px",
  },
});

const InvitePrompt = styled("div", {
  base: {
    marginTop: "8px",
    fontSize: "0.95rem",
    color: "var(--md-sys-color-on-surface-variant)",
    "& a": {
      color: "var(--md-sys-color-primary)",
      fontWeight: 600,
      textDecoration: "none",
      "&:hover": {
        textDecoration: "underline",
      },
    },
  },
});

const SectionTitle = styled("h2", {
  base: {
    fontSize: "1.6rem",
    fontWeight: 700,
    margin: "56px 0 24px",
    textAlign: "center",
  },
});

const Grid = styled("div", {
  base: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    maxWidth: "1050px",
    width: "100%",
    margin: "0 auto",
    padding: "0 24px 64px",
    boxSizing: "border-box",
  },
});

const Card = styled("div", {
  base: {
    background: "var(--md-sys-color-surface-container)",
    borderRadius: "16px",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    border: "1px solid var(--md-sys-color-outline-variant, rgba(255,255,255,0.08))",
    transition: "transform 0.15s ease, background 0.15s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      background: "var(--md-sys-color-surface-container-high)",
    },
  },
});

const CardIcon = styled("div", {
  base: {
    width: "52px",
    height: "52px",
    borderRadius: "14px",
    background: "var(--md-sys-color-surface-container-highest)",
    color: "var(--md-sys-color-primary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "16px",
  },
});

const CardTitle = styled("h3", {
  base: {
    fontSize: "1.2rem",
    fontWeight: 700,
    margin: "0 0 6px",
  },
});

const CardDesc = styled("p", {
  base: {
    fontSize: "0.85rem",
    color: "var(--md-sys-color-on-surface-variant)",
    margin: "0 0 20px",
    flexGrow: 1,
  },
});

interface PlatformInfo {
  name: string;
  icon: string;
  desc: string;
  ext: string;
  url?: string;
  isWeb?: boolean;
  isIos?: boolean;
}

const IosNotice = styled("div", {
  base: {
    maxWidth: "580px",
    margin: "0 0 24px",
    padding: "12px 20px",
    borderRadius: "12px",
    background: "var(--md-sys-color-surface-container-high)",
    border: "1px solid var(--md-sys-color-outline-variant, rgba(255,255,255,0.1))",
    fontSize: "0.95rem",
    lineHeight: 1.5,
    color: "var(--md-sys-color-on-surface-variant)",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    textAlign: "left",
  },
});

export function LandingPage(): JSX.Element {
  const navigate = useNavigate();

  const [os, setOs] = createSignal<{
    name: string;
    icon: string;
    url?: string;
    ext: string;
    isIos?: boolean;
  }>({
    name: "Windows",
    icon: "desktop_windows",
    url: "/downloads/stoat-desktop-setup.exe",
    ext: ".exe",
  });

  onMount(() => {
    const ua = navigator.userAgent.toLowerCase();
    const platform = (navigator as any).userAgentData?.platform?.toLowerCase() || navigator.platform?.toLowerCase() || "";

    if (/android/.test(ua)) {
      setOs({
        name: "Android",
        icon: "android",
        url: "/downloads/stoat-android.apk",
        ext: ".apk",
      });
    } else if (/iphone|ipad|ipod/.test(ua)) {
      setOs({
        name: "iOS (iPhone / iPad)",
        icon: "phone_iphone",
        url: undefined,
        ext: "Веб-версия",
        isIos: true,
      });
    } else if (/win/.test(platform) || /windows/.test(ua)) {
      setOs({
        name: "Windows",
        icon: "desktop_windows",
        url: "/downloads/stoat-desktop-setup.exe",
        ext: ".exe",
      });
    } else if (/mac/.test(platform) || /macintosh/.test(ua)) {
      setOs({
        name: "macOS",
        icon: "laptop_mac",
        url: "/downloads/stoat-desktop-macos.zip",
        ext: ".dmg / .zip",
      });
    } else if (/linux/.test(platform) || /linux/.test(ua)) {
      setOs({
        name: "Linux",
        icon: "terminal",
        url: "/downloads/stoat-desktop-linux.tar.gz",
        ext: ".tar.gz",
      });
    }
  });

  const platforms: PlatformInfo[] = [
    {
      name: "Windows",
      icon: "desktop_windows",
      desc: "Для Windows 10/11 (64-бит)",
      ext: ".exe",
      url: "/downloads/stoat-desktop-setup.exe",
    },
    {
      name: "Android",
      icon: "android",
      desc: "Официальный установочный APK",
      ext: ".apk",
      url: "/downloads/stoat-android.apk",
    },
    {
      name: "Linux",
      icon: "terminal",
      desc: "Ubuntu, Debian, Fedora, Arch",
      ext: ".tar.gz",
      url: "/downloads/stoat-desktop-linux.tar.gz",
    },
    {
      name: "macOS",
      icon: "laptop_mac",
      desc: "Apple Silicon и Intel Mac",
      ext: ".dmg / .zip",
      url: "/downloads/stoat-desktop-macos.zip",
    },
    {
      name: "iOS (iPhone / iPad)",
      icon: "phone_iphone",
      desc: "Приложение не поддерживается, используйте Safari",
      ext: "Веб-версия",
      isIos: true,
    },
    {
      name: "Веб-версия",
      icon: "language",
      desc: "Работает в любом современном браузере",
      ext: "PWA",
      isWeb: true,
    },
  ];

  return (
    <Container>
      <Header>
        <LogoGroup>
          <Wordmark />
        </LogoGroup>
        <Button size="md" variant="outlined" onClick={() => navigate("/login")}>
          Войти в аккаунт
        </Button>
      </Header>

      <Hero>
        <Title>Stoat Chat</Title>
        <Subtitle>
          Приватный мессенджер и голосовой сервер на собственной инфраструктуре.
          Общайтесь свободно в голосовых комнатах и защищенных текстовых каналах.
        </Subtitle>

        {os().isIos ? (
          <IosNotice>
            <Symbol size={28}>info</Symbol>
            <div>
              <strong>Приложение для iOS (iPhone / iPad) пока не поддерживается.</strong>
              <div style={{ "margin-top": "2px", opacity: 0.85 }}>
                Вы можете комфортно общаться прямо в браузере Safari или добавить Stoat на экран «Домой» (PWA).
              </div>
            </div>
          </IosNotice>
        ) : null}

        <ActionsRow>
          {os().url ? (
            <a href={os().url} download style={{ "text-decoration": "none" }}>
              <Button size="lg" style={{ padding: "0 28px" }}>
                <span style={{ display: "inline-flex", "align-items": "center", gap: "12px" }}>
                  <Symbol size={22}>{os().icon}</Symbol>
                  <span>Скачать для {os().name}</span>
                </span>
              </Button>
            </a>
          ) : null}

          <Button
            size="lg"
            variant={os().url ? "tonal" : "filled"}
            onClick={() => navigate("/login")}
            style={{ padding: "0 28px" }}
          >
            <span style={{ display: "inline-flex", "align-items": "center", gap: "12px" }}>
              <Symbol size={22}>language</Symbol>
              <span>Открыть веб-версию</span>
            </span>
          </Button>
        </ActionsRow>

        <InvitePrompt>
          Регистрация только по приглашениям.{" "}
          <A href="/login/create">У вас есть код приглашения?</A>
        </InvitePrompt>
      </Hero>

      <SectionTitle>Доступно на всех платформах</SectionTitle>

      <Grid>
        {platforms.map((p) => (
          <Card>
            <CardIcon>
              <Symbol size={28}>{p.icon}</Symbol>
            </CardIcon>
            <CardTitle>{p.name}</CardTitle>
            <CardDesc>{p.desc}</CardDesc>
            {p.isIos ? (
              <Button
                size="sm"
                variant="outlined"
                onClick={() => navigate("/login")}
                style={{ width: "100%" }}
              >
                Открыть веб-версию
              </Button>
            ) : p.isWeb ? (
              <Button
                size="sm"
                variant="outlined"
                onClick={() => navigate("/login")}
                style={{ width: "100%" }}
              >
                Открыть
              </Button>
            ) : (
              <a
                href={p.url}
                download
                style={{ width: "100%", "text-decoration": "none" }}
              >
                <Button size="sm" variant="outlined" style={{ width: "100%" }}>
                  Скачать {p.ext}
                </Button>
              </a>
            )}
          </Card>
        ))}
      </Grid>
    </Container>
  );
}
export default LandingPage;
