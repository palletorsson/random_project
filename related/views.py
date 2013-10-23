from django.shortcuts import render_to_response
from django.template import RequestContext

from models import Related

def index(request):
    related = Related.objects.filter(active=True)
    return render_to_response('related/index.html', {
        'posts': related,
    }, context_instance=RequestContext(request))
    