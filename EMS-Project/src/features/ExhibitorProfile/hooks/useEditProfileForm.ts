import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useUpdateExhibitorProfile } from "./useUpdateExhibitorProfile";
import type { ExhibitorProfile } from "../types/profileType";
import { resolveMediaUrl } from "../utils/profileUtils";
import { isValidExhibitorName } from "../utils/validation";

interface EditProfileFormErrors {
  name?: string;
  avatar?: string;
}

export function useEditProfileForm(
  exhibitor: ExhibitorProfile,
  onSuccess: () => void,
) {
  const { t } = useTranslation("dashboard");
  const [name, setName] = useState(exhibitor.name);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarObjectUrl, setAvatarObjectUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<EditProfileFormErrors>({});

  const { errorMessage, isPending, submit } =
    useUpdateExhibitorProfile(onSuccess);

  useEffect(() => {
    return () => {
      if (avatarObjectUrl) {
        URL.revokeObjectURL(avatarObjectUrl);
      }
    };
  }, [avatarObjectUrl]);

  const handleAvatarChange = (file: File | null) => {
    if (avatarObjectUrl) {
      URL.revokeObjectURL(avatarObjectUrl);
    }

    if (!file) {
      setAvatarFile(null);
      setAvatarObjectUrl(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrors((current) => ({
        ...current,
        avatar: t("profile.edit.validation.avatarType"),
      }));
      return;
    }

    setErrors((current) => ({ ...current, avatar: undefined }));
    setAvatarFile(file);
    setAvatarObjectUrl(URL.createObjectURL(file));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!isValidExhibitorName(name)) {
      setErrors((current) => ({
        ...current,
        name: t("profile.edit.validation.nameRequired"),
      }));
      return;
    }

    submit({
      name: name.trim(),
      avatar: avatarFile,
      avatarPreviewUrl: avatarObjectUrl,
    });
  };

  return {
    name,
    setName,
    avatarPreview: avatarObjectUrl ?? resolveMediaUrl(exhibitor.avatar),
    handleAvatarChange,
    errors,
    apiError: errorMessage,
    isPending,
    handleSubmit,
    t,
  };
}
