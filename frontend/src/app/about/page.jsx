export default function ResultadoPage() {
  return (
  <div
  className="bg-white text-[#111418] min-h-screen flex flex-col overflow-x-hidden"
  style={{
    fontFamily: 'Lexend, "Noto Sans", sans-serif',
    backgroundColor: 'white',
    marginTop: '63px', 
  }}

    >
      <div className="flex flex-1 flex-col px-4 py-8 md:px-40">
        <div className="flex flex-col max-w-[960px] w-full mx-auto">
          <div className="flex flex-wrap justify-between gap-3 p-4">
            <p className="text-[32px] font-bold leading-tight tracking-tight min-w-72">
              Acerca de Liga Pro
            </p>
          </div>

          <p className="text-base font-normal leading-relaxed pb-3 pt-1 px-4">
            LigaPro es una plataforma integral diseñada para simplificar la gestión de
            torneos de fútbol. Nuestra aplicación está dirigida a organizadores de
            torneos, equipos y jugadores, proporcionando herramientas para crear,
            programar, rastrear y participar en torneos de manera eficiente.
          </p>

          <h3 className="text-lg font-bold leading-tight tracking-tight px-4 pb-2 pt-4">
            Nuestra Misión
          </h3>
          <p className="text-base font-normal leading-relaxed pb-3 pt-1 px-4">
            Nuestra misión es mejorar la experiencia de los torneos de fútbol para todos
            los involucrados. Nos esforzamos por crear una plataforma que no solo
            simplifique las tareas administrativas, sino que también fomente una comunidad
            vibrante de entusiastas del fútbol.
          </p>

          <h3 className="text-lg font-bold leading-tight tracking-tight px-4 pb-2 pt-4">
            Nuestra Visión
          </h3>
          <p className="text-base font-normal leading-relaxed pb-3 pt-1 px-4">
            Visualizamos un futuro donde Liga Pro sea la plataforma de referencia para
            todos los torneos de fútbol, conocida por su interfaz fácil de usar,
            características completas y compromiso con la excelencia. Nuestro objetivo es
            conectar a jugadores, equipos y organizadores, creando una experiencia de
            torneo más atractiva y organizada.
          </p>

          <h3 className="text-lg font-bold leading-tight tracking-tight px-4 pb-2 pt-4">
            Nuestro Equipo
          </h3>
          <p className="text-base font-normal leading-relaxed pb-3 pt-1 px-4">
            Liga Pro es desarrollado por un equipo dedicado de profesionales apasionados
            por el fútbol y la tecnología. Combinamos nuestra experiencia en desarrollo de
            software, gestión deportiva y diseño de experiencia de usuario para ofrecer
            una aplicación que satisfaga las necesidades de nuestra comunidad de usuarios.
          </p>

          <div className="flex w-full p-4">
            <div className="w-full aspect-[3/2] rounded-xl overflow-hidden bg-white flex">
             <div
                className="flex-1 bg-no-repeat bg-center"
                style={{
                  backgroundImage: 'url("/Futbol.png")',
                  backgroundSize: 'auto', 
                }}
              >

              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
