ALLOWED_TRANSITIONS = {
    None: {
        "CLOCKED_IN",
    },
    "CLOCKED_IN": {
        "BREAK_START",
        "LUNCH_START",
        "CLOCKED_OUT",
    },
    "BREAK_START": {
        "BREAK_END",
    },
    "BREAK_END": {
        "BREAK_START",
        "LUNCH_START",
        "CLOCKED_OUT",
    },
    "LUNCH_START": {
        "LUNCH_END",
    },
    "LUNCH_END": {
        "BREAK_START",
        "CLOCKED_OUT",
    },
    "CLOCKED_OUT": set(),
}


STATUS_LABELS = {
    None: "Not Clocked In",
    "CLOCKED_IN": "Clocked In",
    "BREAK_START": "On Break",
    "BREAK_END": "Clocked In",
    "LUNCH_START": "At Lunch",
    "LUNCH_END": "Clocked In",
    "CLOCKED_OUT": "Clocked Out",
}


def get_allowed_attendance_actions(
    latest_event_type: str | None,
) -> list[str]:
    allowed_actions = ALLOWED_TRANSITIONS.get(
        latest_event_type,
        set(),
    )

    return sorted(allowed_actions)


def get_attendance_status_label(
    latest_event_type: str | None,
) -> str:
    return STATUS_LABELS.get(
        latest_event_type,
        "Unknown Status",
    )


def validate_attendance_transition(
    latest_event_type: str | None,
    requested_event_type: str,
) -> None:
    allowed_events = ALLOWED_TRANSITIONS.get(
        latest_event_type,
        set(),
    )

    if requested_event_type not in allowed_events:
        previous_event = (
            latest_event_type
            or "NO_PREVIOUS_EVENT"
        )

        raise ValueError(
            f"Cannot record {requested_event_type} "
            f"after {previous_event}."
        )