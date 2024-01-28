from django.contrib import messages
from django.http import HttpResponse
from django.shortcuts import render
from django.shortcuts import render

def sign_in(request):
    return render(request, 'front/sign_in.html')


def sign_up(request):
    return render(request, 'front/sign_up.html')

def home(request):
    return render(request, 'front/index.html')

def about(request):
    return render(request, 'front/design.html')

def services(request):
    return render(request, 'front/services.html')

def foncier(request):
    return render(request, 'front/foncier.html')