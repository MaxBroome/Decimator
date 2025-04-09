enum DecimatorResponseType {
    Error = 'error',
    Picker = 'picker',
    Redirect = 'redirect',
    Tunnel = 'tunnel',
}

export type DecimatorErrorResponse = {
    status: DecimatorResponseType.Error,
    error: {
        code: string,
        context?: {
            service?: string,
            limit?: number,
        }
    },
};

type DecimatorPartialURLResponse = {
    url: string,
    filename: string,
}

type DecimatorPickerResponse = {
    status: DecimatorResponseType.Picker
    picker: {
        type: 'photo' | 'video' | 'gif',
        url: string,
        thumb?: string,
    }[];
    audio?: string,
    audioFilename?: string,
};

type DecimatorRedirectResponse = {
    status: DecimatorResponseType.Redirect,
} & DecimatorPartialURLResponse;

type DecimatorTunnelResponse = {
    status: DecimatorResponseType.Tunnel,
} & DecimatorPartialURLResponse;

export type DecimatorFileUrlType = "redirect" | "tunnel";

export type DecimatorSession = {
    token: string,
    exp: number,
}

export type DecimatorServerInfo = {
    decimator: {
        version: string,
        url: string,
        startTime: string,
        durationLimit: number,
        turnstileSitekey?: string,
        services: string[]
    },
    git: {
        branch: string,
        commit: string,
        remote: string,
    }
}

export type DecimatorSessionResponse = DecimatorSession | DecimatorErrorResponse;
export type DecimatorServerInfoResponse = DecimatorServerInfo | DecimatorErrorResponse;

export type DecimatorAPIResponse = DecimatorErrorResponse
                              | DecimatorPickerResponse
                              | DecimatorRedirectResponse
                              | DecimatorTunnelResponse;
