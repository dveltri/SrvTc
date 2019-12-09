cls
:loop
java -classpath .;postgresql-9.3-1102.jdbc41.jar  HttpDrvFcp drv1
sleep 5
goto loop

REM START /B java -classpath .;postgresql-9.3-1102.jdbc41.jar  HttpDrvFcp drv1
