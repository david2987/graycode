import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Verificación de Email" />

            <div className="mb-4 text-sm text-gray-600">
                ¡Gracias por registrarte! Antes de comenzar, ¿podrías verificar
                tu dirección de correo electrónico haciendo clic en el enlace que
                acabamos de enviarte? Si no recibiste el correo, con gusto te
                enviaremos otro.
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    Se ha enviado un nuevo enlace de verificación a la dirección
                    de correo electrónico que proporcionaste durante el registro.
                </div>
            )}

            <form onSubmit={submit}>
                <div className="mt-4 flex items-center justify-between">
                    <PrimaryButton disabled={processing}>
                        Reenviar Email de Verificación
                    </PrimaryButton>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Cerrar Sesión
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
