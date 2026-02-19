$(document).ready(function () {
    const API_URL = 'https://diane-domesticable-eliz.ngrok-free.dev/enviar';

    // ── Abrir modal ──
    $('#btnContact, #btnContactFooter').on('click', function () {
        $('#contactModal').removeClass('tw-hidden');
        $('body').css('overflow', 'hidden');
        setTimeout(function () {
            $('#contactModal .modal-panel').css({
                opacity: 1,
                transform: 'scale(1)'
            });
        }, 10);
    });

    // ── Cerrar modal ──
    function closeModal() {
        $('#contactModal .modal-panel').css({
            opacity: 0,
            transform: 'scale(0.95)'
        });
        setTimeout(function () {
            $('#contactModal').addClass('tw-hidden');
            $('body').css('overflow', '');
            resetForm();
        }, 200);
    }

    $('#btnCloseModal').on('click', closeModal);

    $('#contactModal').on('click', function (e) {
        if ($(e.target).is('#contactModal')) {
            closeModal();
        }
    });

    $(document).on('keydown', function (e) {
        if (e.key === 'Escape' && !$('#contactModal').hasClass('tw-hidden')) {
            closeModal();
        }
    });

    // ── Reset formulario ──
    function resetForm() {
        $('#contactForm')[0].reset();
        $('.field-error').text('');
    }

    // ── Validación ──
    function validateForm() {
        let valid = true;
        const nombre = $('#inputNombre').val().trim();
        const correo = $('#inputCorreo').val().trim();
        const asunto = $('#inputAsunto').val().trim();

        $('.field-error').text('');

        if (!nombre) {
            $('#errorNombre').text('El nombre es obligatorio');
            valid = false;
        }

        if (!correo) {
            $('#errorCorreo').text('El correo es obligatorio');
            valid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
            $('#errorCorreo').text('Ingresa un correo válido');
            valid = false;
        }

        if (!asunto) {
            $('#errorAsunto').text('El asunto es obligatorio');
            valid = false;
        }

        return valid;
    }

    // ── Envío del formulario con Ajax ──
    $('#contactForm').on('submit', function (e) {
        e.preventDefault();

        if (!validateForm()) return;

        const $btn = $('#btnSubmit');
        const originalText = $btn.html();

        $btn.prop('disabled', true).html(
            '<span class="spinner"></span>Enviando...'
        );

        const formData = {
            nombre: $('#inputNombre').val().trim(),
            correo: $('#inputCorreo').val().trim(),
            asunto: $('#inputAsunto').val().trim()
        };

        $.ajax({
            url: API_URL,
            method: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            crossDomain: true,
            headers: {
                'ngrok-skip-browser-warning': 'true',
                'Accept': 'application/json'
            },
            data: JSON.stringify(formData),
            success: function (response) {
                $btn.prop('disabled', false).html(originalText);
                closeModal();
                var respMsg = '';
                if (response && typeof response === 'object') {
                    respMsg = response.message || response.msg || JSON.stringify(response);
                } else if (response) {
                    respMsg = response;
                }
                showToast('success', '¡Mensaje enviado! ' + respMsg);
            },
            error: function (xhr, textStatus, errorThrown) {
                $btn.prop('disabled', false).html(originalText);
                var msg = '';

                if (xhr.status === 0) {
                    msg = 'No se pudo conectar con el servidor. Verifica tu conexión o que la API esté activa.';
                } else if (xhr.responseJSON && (xhr.responseJSON.message || xhr.responseJSON.msg)) {
                    msg = xhr.responseJSON.message || xhr.responseJSON.msg;
                } else if (xhr.responseText) {
                    try {
                        var parsed = JSON.parse(xhr.responseText);
                        msg = parsed.message || parsed.msg || xhr.responseText;
                    } catch (e) {
                        msg = 'Error del servidor (código ' + xhr.status + ')';
                    }
                } else {
                    msg = 'Error: ' + textStatus + ' - ' + errorThrown;
                }

                showToast('error', msg);
            }
        });
    });

    // ── Toast Notifications ──
    function showToast(type, message) {
        $('.toast-notification').remove();

        const toast = $(
            '<div class="toast-notification ' + type + '">' + message + '</div>'
        );
        $('body').append(toast);

        setTimeout(function () {
            toast.addClass('show');
        }, 50);

        setTimeout(function () {
            toast.removeClass('show');
            setTimeout(function () {
                toast.remove();
            }, 400);
        }, 4500);
    }

    // ── Scroll suave a proyectos ──
    $('#btnProjects').on('click', function () {
        $('html, body').animate({
            scrollTop: $('#projects').offset().top - 20
        }, 600);
    });
});
