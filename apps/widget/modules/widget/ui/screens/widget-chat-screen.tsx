"use client";

import {
  AISuggestion,
  AISuggestions,
} from "@workspace/ui/components/ai/suggestion";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useThreadMessages, toUIMessages } from "@convex-dev/agent/react";
import { WidgetHeader } from "@/modules/widget/ui/components/widget-header";
import { Button } from "@workspace/ui/components/button";
import { useAtomValue, useSetAtom } from "jotai";
import { ArrowLeftIcon, Loader2Icon } from "lucide-react";
import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import {
  contactSessionIdAtomFamily,
  conversationIdAtom,
  organizationIdAtom,
  screenAtom,
  widgetSettingsAtom,
} from "../../atoms/widget-atoms";
import { useAction, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Form, FormField } from "@workspace/ui/components/form";
import {
  AIConversation,
  AIConversationContent,
  AIConversationScrollButton,
} from "@workspace/ui/components/ai/conversation";
import {
  AIInput,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
  AIInputTools,
} from "@workspace/ui/components/ai/input";
import {
  AIMessage,
  AIMessageContent,
} from "@workspace/ui/components/ai/message";
import { AIResponse } from "@workspace/ui/components/ai/response";
import { useMemo, useState } from "react";

const formSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

export const WidgetChatScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const setConversationId = useSetAtom(conversationIdAtom);

  const widgetSettings = useAtomValue(widgetSettingsAtom);
  const conversationId = useAtomValue(conversationIdAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || ""),
  );

  const onBack = () => {
    setConversationId(null);
    setScreen("selection");
  };

  const suggestions = useMemo(() => {
    if (!widgetSettings) {
      return [];
    }

    return Object.keys(widgetSettings.defaultSuggestions).map((key) => {
      return widgetSettings.defaultSuggestions[
        key as keyof typeof widgetSettings.defaultSuggestions
      ];
    });
  }, [widgetSettings]);

  const conversation = useQuery(
    api.public.conversations.getOne,
    conversationId && contactSessionId
      ? {
          conversationId,
          contactSessionId,
        }
      : "skip",
  );

  const messages = useThreadMessages(
    api.public.messages.getMany,
    conversation?.threadId && contactSessionId
      ? {
          threadId: conversation.threadId,
          contactSessionId,
        }
      : "skip",
    { initialNumItems: 10, stream: true },
  );

  const { topElementRef, handleLoadMore, canLoadMore, isLoadingMore } =
    useInfiniteScroll({
      status: messages.status,
      loadMore: messages.loadMore,
      loadSize: 10,
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
    mode: "onChange",
  });
  const [sendError, setSendError] = useState<string | null>(null);

  const createMessage = useAction(api.public.messages.create);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSendError(null);

    if (!conversation || !contactSessionId) {
      setSendError("Chat session is not ready yet. Please try again.");
      return;
    }

    const prompt = values.message?.trim();
    if (!prompt) {
      return;
    }

    // Clear immediately so the UI feels responsive while the agent generates.
    form.reset();

    try {
      await createMessage({
        threadId: conversation.threadId,
        prompt,
        contactSessionId,
      });
    } catch (error) {
      console.error("Failed to send widget message", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unable to send your message. Please try again.";

      setSendError(errorMessage);
      form.setValue("message", prompt, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }
  };

  const uiMessages = useMemo(() => {
    return toUIMessages(messages.results ?? []);
  }, [messages.results]);

  const hasStreamingAssistantMessage = uiMessages.some((message) => {
    return message.role === "assistant" && message.status === "streaming";
  });

  const showAssistantLoadingBubble =
    form.formState.isSubmitting &&
    !hasStreamingAssistantMessage &&
    conversation?.status !== "resolved";

  const submitStatus = form.formState.isSubmitting
    ? hasStreamingAssistantMessage
      ? "streaming"
      : "submitted"
    : "ready";

  const messageDraft = form.watch("message");
  const canSubmit =
    !!conversation?.threadId &&
    !!contactSessionId &&
    conversation.status !== "resolved" &&
    !form.formState.isSubmitting &&
    !!messageDraft?.trim();

  return (
    <>
      <WidgetHeader>
        <div className="flex items-center gap-x-2">
          <Button onClick={onBack} size="icon" variant="transparent">
            <ArrowLeftIcon />
          </Button>
          <p>Chat</p>
        </div>
      </WidgetHeader>
      <AIConversation>
        <AIConversationContent>
          <InfiniteScrollTrigger
            canLoadMore={canLoadMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={handleLoadMore}
            ref={topElementRef}
          />
          {uiMessages.map((message) => {
            return (
              <AIMessage
                from={message.role === "user" ? "user" : "assistant"}
                key={message.id}
              >
                <AIMessageContent>
                  <AIResponse>{message.content}</AIResponse>
                </AIMessageContent>
                {message.role === "assistant" && (
                  <DicebearAvatar
                    imageUrl="/logo.svg"
                    seed="assistant"
                    size={32}
                  />
                )}
              </AIMessage>
            );
          })}
          {showAssistantLoadingBubble && (
            <AIMessage from="assistant">
              <AIMessageContent>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2Icon className="size-4 animate-spin" />
                  <span>Thinking...</span>
                </div>
              </AIMessageContent>
              <DicebearAvatar imageUrl="/logo.svg" seed="assistant" size={32} />
            </AIMessage>
          )}
        </AIConversationContent>
      </AIConversation>
      {uiMessages.length === 1 && (
        <AISuggestions className="flex w-full flex-col items-end p-2">
          {suggestions.map((suggestion) => {
            if (!suggestion) {
              return null;
            }

            return (
              <AISuggestion
                key={suggestion}
                onClick={() => {
                  form.setValue("message", suggestion, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  });
                  form.handleSubmit(onSubmit)();
                }}
                suggestion={suggestion}
              />
            );
          })}
        </AISuggestions>
      )}
      <Form {...form}>
        <AIInput
          className="rounded-none border-x-0 border-b-0"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <AIInputTextarea
                disabled={conversation?.status === "resolved"}
                onChange={field.onChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (!canSubmit) {
                      return;
                    }
                    form.handleSubmit(onSubmit)();
                  }
                }}
                placeholder={
                  conversation?.status === "resolved"
                    ? "This conversation has been resolved."
                    : "Type your message..."
                }
                readOnly={form.formState.isSubmitting}
                value={field.value}
              />
            )}
          />
          <AIInputToolbar>
            <AIInputTools />
            <AIInputSubmit
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={!canSubmit}
              status={submitStatus}
              type="submit"
            />
          </AIInputToolbar>
        </AIInput>
      </Form>
      {sendError && (
        <p className="px-3 pb-2 text-xs text-destructive">{sendError}</p>
      )}
    </>
  );
};
