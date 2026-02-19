$(document).ready(function () {

    var apiUrl = 'https://diane-domesticable-eliz.ngrok-free.dev/enviar';

    // Abrir el modal al hacer clic en contactame
    $('#btnContact').on('click', function () {
        $('#contactModal').removeClass('tw-hidden');
        $('body').css('overflow', 'hidden');
        setTimeout(function () {
            $('#contactModal .modal-panel').css({ opacity: 1, transform: 'scale(1)' });
        }, 10);
    });

    // Cerrar modal
    function cerrarModal() {
        $('#contactModal .modal-panel').css({ opacity: 0, transform: 'scale(0.95)' });
        setTimeout(function () {
            $('#contactModal').addClass('tw-hidden');
            $('body').css('overflow', '');
            $('#contactForm')[0].reset();
            $('.field-error').text('');
        }, 200);
    }

    $('#btnCloseModal').on('click', cerrarModal);

    // Cerrar si haces clic fuera del modal
    $('#contactModal').on('click', function (e) {
        if ($(e.target).is('#contactModal')) cerrarModal();
    });

    // Cerrar con Escape
    $(document).on('keydown', function (e) {
        if (e.key === 'Escape' && !$('#contactModal').hasClass('tw-hidden')) cerrarModal();
    });

    // Validar campos del formulario
    function validarFormulario() {
        var esValido = true;
        var nombre = $('#inputNombre').val().trim();
        var correo = $('#inputCorreo').val().trim();
        var asunto = $('#inputAsunto').val().trim();
        var regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        $('.field-error').text('');

        if (!nombre) {
            $('#errorNombre').text('El nombre es obligatorio');
            esValido = false;
        }
        if (!correo) {
            $('#errorCorreo').text('El correo es obligatorio');
            esValido = false;
        } else if (!regexCorreo.test(correo)) {
            $('#errorCorreo').text('Ingresa un correo válido');
            esValido = false;
        }
        if (!asunto) {
            $('#errorAsunto').text('El asunto es obligatorio');
            esValido = false;
        }

        return esValido;
    }

    // Enviar formulario con Ajax
    $('#contactForm').on('submit', function (e) {
        e.preventDefault();
        if (!validarFormulario()) return;

        var $btn = $('#btnSubmit');
        var textoOriginal = $btn.html();

        $btn.prop('disabled', true).html('<span class="spinner"></span>Enviando...');

        var datos = {
            nombre: $('#inputNombre').val().trim(),
            correo: $('#inputCorreo').val().trim(),
            asunto: $('#inputAsunto').val().trim()
        };

        // Primero intenta con ajax normal
        $.ajax({
            url: apiUrl,
            method: 'POST',
            data: $.param(datos),
            timeout: 10000,
            success: function (resp) {
                $btn.prop('disabled', false).html(textoOriginal);
                cerrarModal();
                var msg = '';
                if (resp && typeof resp === 'object') {
                    msg = resp.message || resp.msg || JSON.stringify(resp);
                } else if (resp) {
                    msg = String(resp);
                }
                mostrarToast('success', '¡Mensaje enviado! ' + msg);
            },
            error: function () {
                // Si falla por CORS, usa fetch con no-cors como respaldo
                fetch(apiUrl, {
                    method: 'POST',
                    mode: 'no-cors',
                    body: new URLSearchParams(datos)
                }).then(function () {
                    $btn.prop('disabled', false).html(textoOriginal);
                    cerrarModal();
                    mostrarToast('success', '¡Mensaje enviado correctamente!');
                }).catch(function () {
                    $btn.prop('disabled', false).html(textoOriginal);
                    mostrarToast('error', 'No se pudo conectar con el servidor.');
                });
            }
        });
    });

    // Mostrar notificacion tipo toast
    function mostrarToast(tipo, mensaje) {
        $('.toast-notification').remove();
        var toast = $('<div class="toast-notification ' + tipo + '">' + mensaje + '</div>');
        $('body').append(toast);
        setTimeout(function () { toast.addClass('show'); }, 50);
        setTimeout(function () {
            toast.removeClass('show');
            setTimeout(function () { toast.remove(); }, 400);
        }, 4500);
    }

    // Scroll al hacer clic en ver proyectos
    $('#btnProjects').on('click', function () {
        $('html, body').animate({ scrollTop: $('#projects').offset().top - 20 }, 600);
    });

});
