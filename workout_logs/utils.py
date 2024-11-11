# workout_logs/utils.py
import logging
from rest_framework.response import Response
from rest_framework import status
from functools import wraps

logger = logging.getLogger(__name__)

def error_handler(view_func):
    """Декоратор для обработки ошибок и логирования в представлениях."""
    @wraps(view_func)
    def _wrapped_view(view, request, *args, **kwargs):
        try:
            return view_func(view, request, *args, **kwargs)
        except Exception as e:
            view_name = view.__class__.__name__
            logger.error(f"Ошибка в {view_name}: {str(e)}", exc_info=True)
            return Response(
                {'message': 'Внутренняя ошибка сервера. Пожалуйста, попробуйте позже.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    return _wrapped_view
