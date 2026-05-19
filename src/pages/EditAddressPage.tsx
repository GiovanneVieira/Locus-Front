import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { useForm, useStore } from '@tanstack/react-form';
import {
    ArrowLeft,
    MapPin,
    Save,
    Loader2,
    AlertCircle,
    ShieldAlert,
} from 'lucide-react';

import Header from '@/components/Header/Header';
import { Footer } from '@/components/Footer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/feedback/ToastProvider';
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';

import { FormField } from '@/components/forms/FormField';
import { FormSection } from '@/components/forms/FormSection';
import { AmenitySelector } from '@/components/forms/AmenitySelector';
import {
    ImageUploader,
    type UploaderImage,
} from '@/components/forms/ImageUploader';
import { AddressPreviewCard } from '@/components/AddressPreviewCard';

import {
    useAddress,
    useUploadRentableAddressImages,
    useRentableAddressImages,
    useUpdateRentableAddress,
} from '@/hooks/useAddresses';
import { useCurrentUser } from '@/hooks/useAuth';
import { ApiError } from '@/lib/api';
import type {
    UpdateAddressPayload,
    ImageDetailsResponse,
} from '@/lib/types';

interface FormValues {
    title: string;
    description: string;
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    pricePerNight: string;
    maxGuests: string;
    availableFrom: string;
    availableTo: string;
    amenities: string[];
    latitude: string;
    longitude: string;
}

function requireText(value: string, label: string) {
    if (!value || !value.trim()) return `${label} é obrigatório`;
    return undefined;
}

function stringifyImages(images: any[] | undefined): string {
    if (!images) return '';
    return JSON.stringify(
        images.map((img) => ({ id: img.id, s3Key: img.s3Key })),
    );
}

function validateState(value: string) {
    if (!value || !value.trim()) return 'Estado é obrigatório';
    if (value.trim().length !== 2)
        return 'Use a sigla com 2 letras (ex.: SP)';
    return undefined;
}

function validateZip(value: string) {
    if (!value || !value.trim()) return 'CEP é obrigatório';
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length !== 8) return 'CEP deve ter 8 dígitos';
    return undefined;
}

function validateNonNegativeNumber(value: string, label: string) {
    if (!value) return undefined;
    const num = Number(value);
    if (!Number.isFinite(num) || num < 0) return `${label} inválido`;
    return undefined;
}

function validateDateRange(from: string, to: string) {
    if (!from && !to) return undefined;
    if (from && !to) return 'Informe a data final';
    if (!from && to) return 'Informe a data inicial';
    if (new Date(to) < new Date(from))
        return 'A data final precisa vir depois da inicial';
    return undefined;
}

export default function EditAddressPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const toast = useToast();

    const { data: currentUser } = useCurrentUser();
    const {
        data: address,
        isLoading: isLoadingDetails,
        error: fetchError,
    } = useAddress(id);
    const updateMutation = useUpdateRentableAddress(id!);
    const uploadMutation = useUploadRentableAddressImages();

    const [images, setImages] = useState<UploaderImage[]>([]);
    const [submitError, setSubmitError] = useState<string | null>(
        null,
    );
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingValues, setPendingValues] =
        useState<FormValues | null>(null);
    const [isGalleryInitialized, setIsGalleryInitialized] =
        useState(false);

    const isOwner = useMemo(() => {
        // Se o formulário já foi submetido com sucesso e estamos a redirecionar, não bloqueia
        if (updateMutation.isSuccess) return true;

        if (!currentUser?.id || !address) return false;

        // Tenta apanhar o hostId diretamente ou de dentro de um objeto 'host' se o backend mudar o formato
        const rawHostId = address.hostId ?? (address as any).host?.id;
        if (!rawHostId) return false;

        const loggedUserId = String(currentUser.id)
            .trim()
            .toLowerCase();
        const addressHostId = String(rawHostId).trim().toLowerCase();

        return loggedUserId === addressHostId;
    }, [currentUser, address, updateMutation.isSuccess]);

    const resolvedUrls = useRentableAddressImages(address?.images);

    const imagesFingerprint = useMemo(
        () => stringifyImages(address?.images),
        [address?.images],
    );

    useEffect(() => {
        // Só inicializa se o endereço e as URLs existirem, e se ainda não tiver sido feito antes
        if (
            address?.images &&
            resolvedUrls.length > 0 &&
            !isGalleryInitialized
        ) {
            const formattedImages: UploaderImage[] =
                address.images.map((img, index) => ({
                    id: img.id,
                    url: resolvedUrls[index],
                    remote: true,
                }));

            setImages(formattedImages);
            setIsGalleryInitialized(true); // Tranca a inicialização para não sobrescrever deleções locais
        }
    }, [address?.images, resolvedUrls, isGalleryInitialized]);

    // 3. Caso o id do endereço mude (ex: trocou de imóvel), resetamos a trava
    useEffect(() => {
        setIsGalleryInitialized(false);
    }, [id]);

    const formValuesInitial = useMemo<FormValues>(() => {
        if (!address)
            return {
                title: '',
                description: '',
                street: '',
                number: '',
                complement: '',
                neighborhood: '',
                city: '',
                state: '',
                country: 'Brasil',
                zipCode: '',
                pricePerNight: '',
                maxGuests: '',
                availableFrom: '',
                availableTo: '',
                amenities: [],
                latitude: '',
                longitude: '',
            };

        return {
            title: address.title ?? '',
            description: address.description ?? '',
            street: address.street ?? '',
            number: address.houseNumber ?? '',
            complement: address.complement ?? '',
            neighborhood: address.neighborhood ?? '',
            city: address.city ?? '',
            state: address.state ?? '',
            country: address.country ?? 'Brasil',
            zipCode: address.cep ?? '',
            pricePerNight: address.pricePerNight
                ? String(address.pricePerNight)
                : '',
            maxGuests: address.maxGuests
                ? String(address.maxGuests)
                : '',
            availableFrom: address.availableFrom
                ? address.availableFrom.split('T')[0]
                : '',
            availableTo: address.availableTo
                ? address.availableTo.split('T')[0]
                : '',
            amenities: address.amenities ?? [],
            latitude: address.latitude
                ? String(address.latitude)
                : '',
            longitude: address.longitude
                ? String(address.longitude)
                : '',
        };
    }, [address]);

    const form = useForm({
        defaultValues: formValuesInitial,
        onSubmit: async ({ value }) => {
            setPendingValues(value);
            setShowConfirmDialog(true);
        },
    });

    async function executeUpdate() {
        if (!pendingValues || !id) return;
        setShowConfirmDialog(false);
        setSubmitError(null);

        const dateError = validateDateRange(
            pendingValues.availableFrom,
            pendingValues.availableTo,
        );
        if (dateError) {
            setSubmitError(dateError);
            return;
        }

        try {
            let uploadedImages: ImageDetailsResponse[] = [];
            const filesToUpload = images
                .map((img) => img.file ?? null)
                .filter((file): file is File => file !== null);

            if (filesToUpload.length > 0) {
                uploadedImages =
                    await uploadMutation.mutateAsync(filesToUpload);
            }

            const allImageIds: string[] = [];
            let uploadIdx = 0;

            for (const img of images) {
                if (img.remote) {
                    if (img.id) allImageIds.push(img.id);
                } else {
                    const nextUploaded = uploadedImages[uploadIdx++];
                    if (nextUploaded)
                        allImageIds.push(nextUploaded.id);
                }
            }

            const payload: UpdateAddressPayload = {
                // Obrigatório para o @JsonSubTypes do Spring saber qual DTO filho instanciar
                type: 'RENTABLE',

                title: pendingValues.title.trim(),
                description: pendingValues.description.trim() || null,
                street: pendingValues.street.trim(),

                // Mantém como string para respeitar o types.ts e sanar o erro ts(2322)
                number: pendingValues.number.trim(),

                complement: pendingValues.complement.trim() || null,
                neighborhood: pendingValues.neighborhood.trim(),
                city: pendingValues.city.trim(),
                state: pendingValues.state.trim().toUpperCase(),
                country: pendingValues.country.trim(),

                // usa 'zipCode' conforme configurado no @JsonProperty("zipCode") do Java
                zipCode: pendingValues.zipCode.trim(),

                pricePerNight: pendingValues.pricePerNight
                    ? Number(pendingValues.pricePerNight)
                    : null,
                maxGuests: pendingValues.maxGuests
                    ? Number(pendingValues.maxGuests)
                    : null,
                amenities: pendingValues.amenities,
                availableFrom: pendingValues.availableFrom || null,
                availableTo: pendingValues.availableTo || null,

                // Mantendo a compatibilidade caso use os campos de coordenadas
                latitude: pendingValues.latitude
                    ? Number(pendingValues.latitude)
                    : null,
                longitude: pendingValues.longitude
                    ? Number(pendingValues.longitude)
                    : null,

                imageIds: allImageIds,
                mainImageId: allImageIds[0] || undefined,
            };

            console.log(`${JSON.stringify(payload)}`);

            await updateMutation.mutateAsync(payload);
            toast.success(
                'Alterações salvas',
                'Os dados do anúncio foram atualizados com sucesso.',
            );
            navigate(`/enderecos/${id}`, { replace: true });
        } catch (caught) {
            const message =
                caught instanceof ApiError
                    ? caught.message
                    : 'Não foi possível salvar as edições.';
            setSubmitError(message);
            toast.error('Falha ao atualizar', message);
        }
    }

    const watched = useStore(form.store, (state) => state.values);
    const saving =
        updateMutation.isPending || uploadMutation.isPending;

    if (isLoadingDetails) {
        return (
            <div className="flex min-h-screen flex-col bg-background text-foreground">
                <Header />
                <div className="flex flex-1 flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
                    <Loader2
                        size={24}
                        className="animate-spin text-primary"
                    />
                    Buscando dados do endereço...
                </div>
                <Footer />
            </div>
        );
    }

    if (fetchError || !address) {
        return (
            <div className="flex min-h-screen flex-col bg-background text-foreground">
                <Header />
                <div className="mx-auto flex max-w-md flex-1 flex-col justify-center text-center px-6">
                    <AlertCircle
                        size={40}
                        className="mx-auto mb-4 text-destructive"
                    />
                    <h2 className="text-xl font-semibold">
                        Hospedagem não encontrada
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        O endereço informado não existe ou foi
                        removido do sistema.
                    </p>
                    <Button
                        asChild
                        className="mt-5 rounded-xl"
                        variant="outline">
                        <Link to="/enderecos/meus">
                            Voltar para meus imóveis
                        </Link>
                    </Button>
                </div>
                <Footer />
            </div>
        );
    }

    if (!isOwner && !saving && !updateMutation.isSuccess) {
        return (
            <div className="flex min-h-screen flex-col bg-background text-foreground">
                <Header />
                <div className="mx-auto flex max-w-md flex-1 flex-col justify-center text-center px-6">
                    <ShieldAlert
                        size={44}
                        className="mx-auto mb-4 text-amber-500"
                    />
                    <h2 className="text-xl font-semibold tracking-tight">
                        Acesso Negado
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Você não tem permissão para modificar este
                        anúncio porque ele pertence a outro anfitrião.
                    </p>
                    <Button
                        asChild
                        className="mt-5 rounded-xl bg-secondary text-foreground hover:bg-secondary/80">
                        <Link to="/enderecos">
                            Voltar para buscas
                        </Link>
                    </Button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />
            <main className="mx-auto max-w-7xl px-6 py-10">
                <Breadcrumbs
                    items={[
                        { label: 'Hospedagens', href: '/enderecos' },
                        {
                            label: 'Minhas Hospedagens',
                            href: '/enderecos/meus',
                        },
                        { label: 'Editar' },
                    ]}
                    className="mb-4"
                />
                <Link
                    to="/enderecos/meus"
                    className="mb-5 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground">
                    <ArrowLeft size={14} /> Cancelar e voltar
                </Link>

                <div className="mb-8">
                    <span className="section-badge">
                        <MapPin size={12} /> Painel do anfitrião
                    </span>
                    <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                        Editar anúncio: {address.title}
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                        Altere os campos necessários.
                    </p>
                </div>

                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        form.handleSubmit();
                    }}
                    className="grid gap-6 lg:grid-cols-[1.45fr_1fr] lg:items-start">
                    <div className="flex flex-col gap-7 rounded-3xl border border-border bg-card p-6 shadow-sm">
                        <FormSection
                            title="Identificação"
                            description="Apresentação no catálogo.">
                            <form.Field
                                name="title"
                                validators={{
                                    onBlur: ({ value }) =>
                                        requireText(value, 'Título'),
                                }}>
                                {(field) => (
                                    <FormField
                                        label="Título do anúncio"
                                        required
                                        error={
                                            field.state.meta
                                                .errors[0] as
                                                | string
                                                | undefined
                                        }>
                                        <Input
                                            id="title"
                                            value={field.state.value}
                                            onChange={(event) =>
                                                field.handleChange(
                                                    event.target
                                                        .value,
                                                )
                                            }
                                            onBlur={field.handleBlur}
                                            maxLength={120}
                                            className="h-11 rounded-xl"
                                        />
                                    </FormField>
                                )}
                            </form.Field>
                            <form.Field name="description">
                                {(field) => (
                                    <FormField
                                        label="Descrição"
                                        hint="Diferenciais do espaço.">
                                        <Textarea
                                            id="description"
                                            value={field.state.value}
                                            onChange={(event) =>
                                                field.handleChange(
                                                    event.target
                                                        .value,
                                                )
                                            }
                                            rows={4}
                                            maxLength={1200}
                                        />
                                    </FormField>
                                )}
                            </form.Field>
                        </FormSection>

                        <Separator />

                        <FormSection
                            title="Endereço"
                            description="Onde o imóvel fica.">
                            <div className="grid gap-3 md:grid-cols-[2fr_1fr_1.2fr]">
                                <form.Field
                                    name="street"
                                    validators={{
                                        onBlur: ({ value }) =>
                                            requireText(value, 'Rua'),
                                    }}>
                                    {(field) => (
                                        <FormField
                                            label="Rua"
                                            required
                                            error={
                                                field.state.meta
                                                    .errors[0] as
                                                    | string
                                                    | undefined
                                            }>
                                            <Input
                                                value={
                                                    field.state.value
                                                }
                                                onChange={(event) =>
                                                    field.handleChange(
                                                        event.target
                                                            .value,
                                                    )
                                                }
                                                onBlur={
                                                    field.handleBlur
                                                }
                                                className="h-11 rounded-xl"
                                            />
                                        </FormField>
                                    )}
                                </form.Field>
                                <form.Field
                                    name="number"
                                    validators={{
                                        onBlur: ({ value }) =>
                                            requireText(
                                                value,
                                                'Número',
                                            ),
                                    }}>
                                    {(field) => (
                                        <FormField
                                            label="Número"
                                            required
                                            error={
                                                field.state.meta
                                                    .errors[0] as
                                                    | string
                                                    | undefined
                                            }>
                                            <Input
                                                value={
                                                    field.state.value
                                                }
                                                maxLength={10} // 📏 1. Limita o tamanho físico para ninguém digitar uma redação
                                                placeholder="Ex: 123, S/N, 45-A"
                                                onChange={(event) => {
                                                    const rawValue =
                                                        event.target
                                                            .value;

                                                    // ⚙️ 2. RegEx de limpeza: Permite apenas números, letras, hífen, barra e espaço
                                                    // Impede o usuário de digitar caracteres especiais inválidos como @, $, %, etc.
                                                    const cleaned =
                                                        rawValue.replace(
                                                            /[^A-Za-z0-9\/\s-]/g,
                                                            '',
                                                        );

                                                    field.handleChange(
                                                        cleaned,
                                                    );
                                                }}
                                                onBlur={
                                                    field.handleBlur
                                                }
                                                className="h-11 rounded-xl"
                                            />
                                        </FormField>
                                    )}
                                </form.Field>
                                <form.Field name="complement">
                                    {(field) => (
                                        <FormField label="Complemento">
                                            <Input
                                                value={
                                                    field.state.value
                                                }
                                                onChange={(event) =>
                                                    field.handleChange(
                                                        event.target
                                                            .value,
                                                    )
                                                }
                                                className="h-11 rounded-xl"
                                            />
                                        </FormField>
                                    )}
                                </form.Field>
                            </div>

                            <div className="grid gap-3 md:grid-cols-2">
                                <form.Field
                                    name="neighborhood"
                                    validators={{
                                        onBlur: ({ value }) =>
                                            requireText(
                                                value,
                                                'Bairro',
                                            ),
                                    }}>
                                    {(field) => (
                                        <FormField
                                            label="Bairro"
                                            required
                                            error={
                                                field.state.meta
                                                    .errors[0] as
                                                    | string
                                                    | undefined
                                            }>
                                            <Input
                                                value={
                                                    field.state.value
                                                }
                                                onChange={(event) =>
                                                    field.handleChange(
                                                        event.target
                                                            .value,
                                                    )
                                                }
                                                onBlur={
                                                    field.handleBlur
                                                }
                                                className="h-11 rounded-xl"
                                            />
                                        </FormField>
                                    )}
                                </form.Field>
                                <form.Field
                                    name="zipCode"
                                    validators={{
                                        onBlur: ({ value }) =>
                                            validateZip(value),
                                    }}>
                                    {(field) => (
                                        <FormField
                                            label="CEP"
                                            required
                                            error={
                                                field.state.meta
                                                    .errors[0] as
                                                    | string
                                                    | undefined
                                            }>
                                            <Input
                                                value={
                                                    field.state.value
                                                }
                                                onChange={(event) => {
                                                    const onlyDigits =
                                                        event.target.value
                                                            .replace(
                                                                /\D/g,
                                                                '',
                                                            )
                                                            .slice(
                                                                0,
                                                                8,
                                                            );
                                                    const formatted =
                                                        onlyDigits.length >
                                                        5
                                                            ? `${onlyDigits.slice(0, 5)}-${onlyDigits.slice(5)}`
                                                            : onlyDigits;
                                                    field.handleChange(
                                                        formatted,
                                                    );
                                                }}
                                                onBlur={
                                                    field.handleBlur
                                                }
                                                className="h-11 rounded-xl"
                                                inputMode="numeric"
                                            />
                                        </FormField>
                                    )}
                                </form.Field>
                            </div>

                            <div className="grid gap-3 md:grid-cols-3">
                                <form.Field
                                    name="city"
                                    validators={{
                                        onBlur: ({ value }) =>
                                            requireText(
                                                value,
                                                'Cidade',
                                            ),
                                    }}>
                                    {(field) => (
                                        <FormField
                                            label="Cidade"
                                            required
                                            error={
                                                field.state.meta
                                                    .errors[0] as
                                                    | string
                                                    | undefined
                                            }>
                                            <Input
                                                value={
                                                    field.state.value
                                                }
                                                onChange={(event) =>
                                                    field.handleChange(
                                                        event.target
                                                            .value,
                                                    )
                                                }
                                                onBlur={
                                                    field.handleBlur
                                                }
                                                className="h-11 rounded-xl"
                                            />
                                        </FormField>
                                    )}
                                </form.Field>
                                <form.Field
                                    name="state"
                                    validators={{
                                        onBlur: ({ value }) =>
                                            validateState(value),
                                    }}>
                                    {(field) => (
                                        <FormField
                                            label="UF"
                                            required
                                            error={
                                                field.state.meta
                                                    .errors[0] as
                                                    | string
                                                    | undefined
                                            }>
                                            <Input
                                                value={
                                                    field.state.value
                                                }
                                                onChange={(event) =>
                                                    field.handleChange(
                                                        event.target.value
                                                            .toUpperCase()
                                                            .slice(
                                                                0,
                                                                2,
                                                            ),
                                                    )
                                                }
                                                onBlur={
                                                    field.handleBlur
                                                }
                                                className="h-11 rounded-xl uppercase"
                                            />
                                        </FormField>
                                    )}
                                </form.Field>
                                <form.Field
                                    name="country"
                                    validators={{
                                        onBlur: ({ value }) =>
                                            requireText(
                                                value,
                                                'País',
                                            ),
                                    }}>
                                    {(field) => (
                                        <FormField
                                            label="País"
                                            required
                                            error={
                                                field.state.meta
                                                    .errors[0] as
                                                    | string
                                                    | undefined
                                            }>
                                            <Input
                                                value={
                                                    field.state.value
                                                }
                                                onChange={(event) =>
                                                    field.handleChange(
                                                        event.target
                                                            .value,
                                                    )
                                                }
                                                onBlur={
                                                    field.handleBlur
                                                }
                                                className="h-11 rounded-xl"
                                            />
                                        </FormField>
                                    )}
                                </form.Field>
                            </div>
                        </FormSection>

                        <Separator />

                        <FormSection
                            title="Disponibilidade e capacidade"
                            description="Regras operacionais.">
                            <div className="grid gap-3 md:grid-cols-3">
                                <form.Field name="availableFrom">
                                    {(field) => (
                                        <FormField label="Check-in a partir de">
                                            <Input
                                                type="date"
                                                value={
                                                    field.state.value
                                                }
                                                onChange={(event) =>
                                                    field.handleChange(
                                                        event.target
                                                            .value,
                                                    )
                                                }
                                                className="h-11 rounded-xl"
                                            />
                                        </FormField>
                                    )}
                                </form.Field>
                                <form.Field name="availableTo">
                                    {(field) => (
                                        <FormField label="Check-out até">
                                            <Input
                                                type="date"
                                                value={
                                                    field.state.value
                                                }
                                                min={
                                                    watched.availableFrom ||
                                                    undefined
                                                }
                                                onChange={(event) =>
                                                    field.handleChange(
                                                        event.target
                                                            .value,
                                                    )
                                                }
                                                className="h-11 rounded-xl"
                                            />
                                        </FormField>
                                    )}
                                </form.Field>
                                <form.Field
                                    name="maxGuests"
                                    validators={{
                                        onBlur: ({ value }) =>
                                            validateNonNegativeNumber(
                                                value,
                                                'Capacidade',
                                            ),
                                    }}>
                                    {(field) => (
                                        <FormField
                                            label="Hóspedes (máx.)"
                                            error={
                                                field.state.meta
                                                    .errors[0] as
                                                    | string
                                                    | undefined
                                            }>
                                            <Input
                                                type="number"
                                                inputMode="numeric"
                                                min={1}
                                                max={20}
                                                value={
                                                    field.state.value
                                                }
                                                onChange={(event) =>
                                                    field.handleChange(
                                                        event.target
                                                            .value,
                                                    )
                                                }
                                                onBlur={
                                                    field.handleBlur
                                                }
                                                className="h-11 rounded-xl"
                                            />
                                        </FormField>
                                    )}
                                </form.Field>
                            </div>
                            <form.Field
                                name="pricePerNight"
                                validators={{
                                    onBlur: ({ value }) =>
                                        validateNonNegativeNumber(
                                            value,
                                            'Preço',
                                        ),
                                }}>
                                {(field) => (
                                    <FormField
                                        label="Preço por noite (R$)"
                                        error={
                                            field.state.meta
                                                .errors[0] as
                                                | string
                                                | undefined
                                        }>
                                        <Input
                                            type="number"
                                            inputMode="numeric"
                                            min={0}
                                            value={field.state.value}
                                            onChange={(event) =>
                                                field.handleChange(
                                                    event.target
                                                        .value,
                                                )
                                            }
                                            onBlur={field.handleBlur}
                                            className="h-11 rounded-xl"
                                        />
                                    </FormField>
                                )}
                            </form.Field>
                        </FormSection>

                        <Separator />

                        <FormSection
                            title="O que o imóvel oferece"
                            description="Amenidades.">
                            <form.Field name="amenities">
                                {(field) => (
                                    <AmenitySelector
                                        value={field.state.value}
                                        onChange={(next) =>
                                            field.handleChange(next)
                                        }
                                    />
                                )}
                            </form.Field>
                        </FormSection>

                        <Separator />

                        <FormSection
                            title="Imagens do imóvel"
                            description="Fotos do espaço.">
                            <ImageUploader
                                images={images}
                                onChange={setImages}
                                externalError={
                                    uploadMutation.error instanceof
                                    Error
                                        ? uploadMutation.error.message
                                        : null
                                }
                            />
                        </FormSection>

                        {submitError && (
                            <div
                                role="alert"
                                className="flex items-start gap-2 rounded-2xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                                <AlertCircle
                                    size={16}
                                    className="mt-0.5 shrink-0"
                                />
                                <span>{submitError}</span>
                            </div>
                        )}

                        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-border pt-5">
                            <Button
                                asChild
                                type="button"
                                variant="outline"
                                className="h-11 rounded-xl px-5"
                                disabled={saving}>
                                <Link to="/enderecos/meus">
                                    Cancelar
                                </Link>
                            </Button>
                            <Button
                                type="submit"
                                className="h-11 rounded-xl px-6 shadow-md"
                                disabled={saving}>
                                {saving ? (
                                    <>
                                        <Loader2
                                            size={16}
                                            className="animate-spin"
                                        />{' '}
                                        Salvando...
                                    </>
                                ) : (
                                    <>
                                        <Save size={16} /> Gravar
                                        alterações
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    <AddressPreviewCard
                        title={watched.title}
                        description={watched.description}
                        city={watched.city}
                        state={watched.state}
                        neighborhood={watched.neighborhood}
                        pricePerNight={watched.pricePerNight}
                        maxGuests={watched.maxGuests}
                        availableFrom={watched.availableFrom}
                        availableTo={watched.availableTo}
                        amenities={watched.amenities}
                        imageUrls={images.map((image) => image.url)}
                    />
                </form>
            </main>

            <Footer />
            <ConfirmDialog
                open={showConfirmDialog}
                onOpenChange={setShowConfirmDialog}
                title="Confirmar updates?"
                description="As mudanças entrarão em vigor imediatamente no catálogo global do Locus."
                confirmLabel="Sim, salvar alterações"
                loading={saving}
                onConfirm={executeUpdate}
            />
        </div>
    );
}
