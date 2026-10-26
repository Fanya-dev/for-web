import { For, Match, Show, Switch, createSignal, onMount } from "solid-js";
import { Trans } from "@lingui/solid/macro";
import { styled } from "styled-system/jsx";

import { useClient } from "@revolt/client";
import { Button, CategoryButton, Column, Row, Text, iconSize, useSnackbar } from "@revolt/ui";
import { Symbol } from "@revolt/ui/components/utils/Symbol";
import MdAddUser from "@material-design-icons/svg/outlined/group_add.svg?component-solid";
import MdContentCopy from "@material-design-icons/svg/outlined/content_copy.svg?component-solid";
import MdCheck from "@material-design-icons/svg/outlined/check.svg?component-solid";

interface InviteItem {
  code: string;
  url: string;
  created_at: string;
}

const InviteRow = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 12px",
    borderRadius: "8px",
    background: "var(--md-sys-color-surface-container-high)",
    gap: "8px",
  },
});

const CodeBadge = styled("span", {
  base: {
    fontFamily: "monospace",
    fontWeight: "bold",
    letterSpacing: "1px",
    color: "var(--md-sys-color-primary)",
    fontSize: "1.05em",
  },
});

export function InviteFriendSection() {
  const client = useClient();
  const snackbar = useSnackbar();

  const [invites, setInvites] = createSignal<InviteItem[]>([]);
  const [loading, setLoading] = createSignal(false);
  const [copiedCode, setCopiedCode] = createSignal<string | null>(null);

  function getAuthHeader(): Record<string, string> {
    try {
      const [headerName, headerValue] = client().authenticationHeader;
      return { [headerName]: headerValue };
    } catch {
      return {};
    }
  }

  async function loadInvites() {
    try {
      const res = await fetch("/api/custom/invite/list", {
        headers: getAuthHeader(),
      });
      if (res.ok) {
        const data = await res.json();
        setInvites(data.invites || []);
      }
    } catch (e) {
      console.error("Failed to load invites:", e);
    }
  }

  onMount(() => {
    loadInvites();
  });

  async function shareOrCopy(url: string, code: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 3000);

      let shared = false;
      if (navigator.share) {
        try {
          await navigator.share({
            title: "Приглашение в Stoat Chat",
            text: "Присоединяйся ко мне в Stoat Chat!",
            url: url,
          });
          shared = true;
        } catch (err: any) {
          // User cancelled or share dismissed
        }
      }

      if (!shared) {
        snackbar.show({
          message: "Ссылка-приглашение скопирована в буфер обмена!",
        });
      }
    } catch (e) {
      snackbar.show({
        message: `Код инвайта: ${code}`,
      });
    }
  }

  async function handleCreateInvite() {
    if (loading()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/custom/invite/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
      });

      if (!res.ok) {
        throw new Error("Failed to generate invite");
      }

      const data: InviteItem = await res.json();
      await shareOrCopy(data.url, data.code);
      await loadInvites();
    } catch (err) {
      snackbar.show({
        message: "Ошибка при генерации приглашения",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <CategoryButton.Group>
      <CategoryButton.Collapse
        icon={<MdAddUser {...iconSize(22)} />}
        title={<Trans>Пригласить друга</Trans>}
        description={
          invites().length > 0
            ? `Активных инвайтов: ${invites().length} из 5. Нажмите для управления`
            : "Создать ссылку для регистрации нового пользователя (до 5 активных)"
        }
      >
        <Column gap="md" style={{ padding: "12px 16px" }}>
          <Row justify="space-between" align="center">
            <Text size="normal">
              Максимум 5 активных инвайтов. При создании 6-го самый старый неиспользованный аннулируется.
            </Text>
            <Button
              size="sm"
              disabled={loading()}
              onClick={handleCreateInvite}
            >
              <Switch fallback={<Trans>Создать ссылку</Trans>}>
                <Match when={loading()}>
                  <Trans>Генерация...</Trans>
                </Match>
              </Switch>
            </Button>
          </Row>

          <Show when={invites().length > 0}>
            <Column gap="sm">
              <Text size="small" style={{ opacity: 0.7 }}>
                Активные коды приглашений:
              </Text>
              <For each={invites()}>
                {(inv) => (
                  <InviteRow>
                    <CodeBadge>{inv.code}</CodeBadge>
                    <Row gap="sm" align="center">
                      <Button
                        size="sm"
                        variant="outlined"
                        onClick={() => shareOrCopy(inv.url, inv.code)}
                      >
                        <Switch fallback={<MdContentCopy {...iconSize(16)} />}>
                          <Match when={copiedCode() === inv.code}>
                            <MdCheck {...iconSize(16)} />
                          </Match>
                        </Switch>
                        {" "}
                        {copiedCode() === inv.code ? "Скопировано" : "Поделиться"}
                      </Button>
                    </Row>
                  </InviteRow>
                )}
              </For>
            </Column>
          </Show>
        </Column>
      </CategoryButton.Collapse>
    </CategoryButton.Group>
  );
}
