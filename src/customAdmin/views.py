from django.http import HttpResponse

# Create your views here.
def mi_vista_personalizada(request):
    # Lógica de la vista
    return HttpResponse(request.META['REMOTE_ADDR'])
